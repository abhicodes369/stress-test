# API Stress Tester

![finalstresstestdemo](https://github.com/user-attachments/assets/de015b65-e98f-46e6-9978-9a0cf9fb77d8)
![finalstresstestdemo2](https://github.com/user-attachments/assets/36611d95-d9e2-4b33-9556-16c2be5dd1f3)
![finalstresstestdemo3](https://github.com/user-attachments/assets/3b3911d1-3d88-4bb1-9298-635c5008eb16)
![finalstresstestdemo4](https://github.com/user-attachments/assets/172d3c24-c9e6-44a6-afc3-41d1fa8f9216)






A modern, responsive web application for testing API performance under heavy load conditions, with real-time visualizations and performance metrics.

## Features

- ✅ **Comprehensive Testing**: Send hundreds or thousands of requests with configurable concurrency
- 📊 **Real-time Visualizations**: Monitor active tests with dynamic charts and graphs
- 🌓 **Dark/Light Mode**: Seamless theme switching with persistent user preferences
- 📱 **Responsive Design**: Works beautifully on desktops, tablets, and mobile devices
- 📈 **Detailed Metrics**: Track success rates, response times, throughput, and error rates
- 🔄 **WebSocket Support**: Live updates during stress tests
- 💾 **Resource Monitoring**: Tracks CPU and memory usage during tests

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Configuration](#configuration)
- [Customization](#customization)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- A backend server for processing stress tests (WebSocket endpoint at `ws://localhost:8080/stress-test`)

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/api-stress-tester.git
   cd api-stress-tester
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
api-stress-tester/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── test.jsx          # Stress test form component
│   │   └── graph.jsx         # Data visualization component
│   ├── App.jsx               # Main application component
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
├── package.json
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md
```

## Usage

### Running a Stress Test

1. Enter the target API URL in the URL field
2. Configure the number of requests (1-10,000)
3. Set concurrency level (1-500)
4. Click "Run Stress Test"
5. Monitor real-time metrics during the test
6. View detailed results after test completion

### Interpreting Results

The application provides several visualizations:

1. **Requests Summary**: Shows total requests, successes, and failures
2. **Response Time Distribution**: Displays response times across all requests
3. **Requests per Second**: Shows throughput over time
4. **Error Rate Over Time**: Tracks percentage of failed requests

## Configuration

### WebSocket Connection

The application connects to a WebSocket server at `ws://localhost:8080/stress-test`. To change this endpoint, modify the WebSocket URL in the `test.jsx` file:

```javascript
const ws = new WebSocket("ws://localhost:8080/stress-test");
```

### Test Parameters

You can adjust the default test parameters in `test.jsx`:

```javascript
const [requests, setRequests] = useState(100);
const [concurrency, setConcurrency] = useState(10);
```

## Customization

### Theming

The application uses Tailwind CSS for styling with a custom color palette. To modify themes:

1. Edit the color variables in `index.css` for light/dark mode
2. Update the Tailwind configuration in `tailwind.config.js`

### Charts

Charts are built using Recharts. To customize visualizations:

1. Modify chart configurations in `graph.jsx`
2. Update chart colors, styles, and layouts as needed
3. Add new chart types by extending the existing components

## Technology Stack

- **React**: UI library for building component-based interfaces
- **React Router**: Navigation and routing solution
- **Recharts**: Composable charting library for data visualization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Modern SVG icon set
- **WebSockets**: For real-time data communication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- The Recharts team for the amazing charting library
- The Lucide team for their beautiful and accessible icons
- The Tailwind CSS team for the utility-first CSS framework
