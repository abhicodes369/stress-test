package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/valyala/fasthttp"
	"log"
	"net/http"
	"sync"
	"time"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type StressTestRequest struct {
	URL         string `json:"url"`
	Requests    int    `json:"requests"`
	Concurrency int    `json:"concurrency"`
}

type StressTestResult struct {
	TotalRequests int             `json:"total_requests"`
	Success       int             `json:"success"`
	Failures      int             `json:"failures"`
	Duration      time.Duration   `json:"duration"`
	ResourceUsage []ResourceUsage `json:"resource_usage"`
}

type ResourceUsage struct {
	Timestamp    time.Time `json:"timestamp"`
	CPUUsage     float64   `json:"cpu_usage"`
	MemUsage     uint64    `json:"mem_usage"`
	ResponseTime float64   `json:"response_time"`
}

func stressTest(url string, requests, concurrency int, conn *websocket.Conn, mu *sync.Mutex) StressTestResult {
	var wg sync.WaitGroup
	var success, failures int
	start := time.Now()
	resourceUsage := make([]ResourceUsage, 0)

	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			client := &fasthttp.Client{}
			req := fasthttp.AcquireRequest()
			resp := fasthttp.AcquireResponse()
			defer fasthttp.ReleaseRequest(req)
			defer fasthttp.ReleaseResponse(resp)

			req.SetRequestURI(url)

			for j := 0; j < requests/concurrency; j++ {
				requestStart := time.Now() // Start time of the request
				if err := client.Do(req, resp); err != nil {
					failures++
				} else {
					if resp.StatusCode() == http.StatusOK {
						success++
					} else {
						failures++
					}
				}
				responseTime := time.Since(requestStart).Seconds() // Calculate response time

				// Simulate resource usage (replace with actual monitoring)
				cpuUsage := 0.5 + float64(j)*0.01
				memUsage := uint64(100 + j*10)
				resourceUsage = append(resourceUsage, ResourceUsage{
					Timestamp:    time.Now(),
					CPUUsage:     cpuUsage,
					MemUsage:     memUsage,
					ResponseTime: responseTime, // Include response time
				})

				// Send live update to the frontend
				update := map[string]interface{}{
					"success":        success,
					"failures":       failures,
					"resource_usage": resourceUsage[len(resourceUsage)-1],
				}

				// Use a mutex to synchronize WebSocket writes
				mu.Lock()
				if err := conn.WriteJSON(update); err != nil {
					log.Println("WebSocket write error:", err)
				}
				mu.Unlock()
			}
		}()
	}

	wg.Wait()
	duration := time.Since(start)

	return StressTestResult{
		TotalRequests: requests,
		Success:       success,
		Failures:      failures,
		Duration:      duration,
		ResourceUsage: resourceUsage,
	}
}

func handleStressTest(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	var req StressTestRequest
	if err := conn.ReadJSON(&req); err != nil {
		log.Println("Failed to read request:", err)
		return
	}

	var mu sync.Mutex
	result := stressTest(req.URL, req.Requests, req.Concurrency, conn, &mu)
	conn.WriteJSON(result)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/stress-test", handleStressTest)

	fmt.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
