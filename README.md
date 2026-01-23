# Nobel Prize Wrapper API

A simple and efficient REST API wrapper for the official [Nobel Prize API (v2.1)](https://www.nobelprize.org/about/developer-zone-2/). This project serves as a proxy to interact with Nobel Prize data, providing information about prizes and laureates.

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Lyaniles/Nobelprize.git
    cd Nobelprize
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    The project comes with a default configuration, but you can ensure your `.env` file is set up:
    ```env
    NOBEL_API_BASE_URL=https://api.nobelprize.org/2.1
    PORT=3000
    ```

### Running the Server

Start the application in development mode:

```bash
npm start
```

*   **API:** `http://localhost:3000/api/prizes`
*   **Web Dashboard:** `http://localhost:3000/` (Open this in your browser!)

The server will start on `http://localhost:3000`.

---

##  API Endpoints

Here are the available endpoints you can interact with.

### Base Info
*   **Get API Info:**
    `http://localhost:3000/`
    *   Returns basic API information and version.

### Prizes
*   **Get Nobel Prizes:**
    `http://localhost:3000/api/prizes`
    *   Fetches a list of Nobel Prizes.
    *   **Query Parameters:** (All standard Nobel API parameters are supported)
        *   `limit`: Number of results (default: 25)
        *   `offset`: Number of results to skip.
        *   `sort`: Sort order (`asc` or `desc`).
        *   `nobelPrizeYear`: Filter by specific year (e.g., `2023`).
        *   `yearTo`: Filter range end year.
        *   `category`: Filter by category (e.g., `phy`, `che`, `med`, `lit`, `peace`, `eco`).

    **Example:**
    `http://localhost:3000/api/prizes?nobelPrizeYear=2020&category=peace`

### Laureates
*   **Get Laureates:**
    `http://localhost:3000/api/laureates`
    *   Fetches a list of Nobel Laureates (people and organizations).
    *   **Query Parameters:**
        *   `limit`: Number of results.
        *   `offset`: Skip results.
        *   `sort`: Sort order.
        *   `ID`: Search by Laureate ID.
        *   `bornDate`: Search by birth date.

    **Example:**
    `http://localhost:3000/api/laureates?limit=5`

---

##  Built With

*   **Node.js** - Runtime environment
*   **Express** - Web framework
*   **Axios** - HTTP client
*   **Cors** - Cross-Origin Resource Sharing
*   **Dotenv** - Environment variable management