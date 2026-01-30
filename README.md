# Nobel Prize Wrapper API & Analytics Tool

A robust solution for interacting with the Nobel Prize API, featuring a REST API Wrapper, a Web Dashboard, and a CLI Analytics Tool.

##  Getting Started

### Prerequisites
- Node.js (v14+)
- npm

### Installation
1.  **Clone:**
    ```bash
    git clone https://github.com/Lyaniles/Nobelprize.git
    cd Nobelprize
    ```
2.  **Install:**
    ```bash
    npm install
    ```
3.  **Config:**
    The project uses a hierarchical configuration system.
    *   **Default:** `config/default.json`
    *   **Env:** `.env` (overrides default)
    *   **CLI:** Arguments (overrides env)

---

##  Web Server & Dashboard

Start the Express server to access the API and the GUI.

```bash
npm start
```

*   **Dashboard:** `http://localhost:3000/` (Browse prizes visually)
*   **API Endpoint:** `http://localhost:3000/api/prizes`

---

##  Analytics CLI Tool

We provide a dedicated script for fetching, analyzing, and storing Nobel Prize data.

### Usage
Run the analysis script via Node.js:

```bash
node src/scripts/analyze.js [options]
```

### Options
*   `--year`: Filter by year (e.g., `2023`).
*   `--category`: Filter by category (`phy`, `che`, `med`, `lit`, `peace`, `eco`).
*   `--outputFile`: Specify output filename (default: `nobel_stats.json`).
*   `--logLevel`: Set logging detail (`info`, `debug`, `error`).

### Examples

**1. Analyze Physics Prizes in 2023:**
```bash
node src/scripts/analyze.js --year=2023 --category=phy
```

**2. Analyze specific year and save to custom file:**
```bash
node src/scripts/analyze.js --year=2020 --outputFile="2020_analysis.json"
```

### Output
The script will:
1.  **Log** progress to the console and `combined.log`.
2.  **Display** a summary table of statistics.
3.  **Save** the detailed JSON result to `data/nobel_stats.json` (or specified file).

---

##  Configuration

You can configure the application via `.env` variables or `config/default.json`.

| Variable | Description | Default |
|----------|-------------|---------|
| `NOBEL_API_BASE_URL` | Official API URL | `https://api.nobelprize.org/2.1` |
| `PORT` | Web Server Port | `3000` |
| `LOG_LEVEL` | Logging verbosity | `info` |

---

##  Tech Stack
*   **Core:** Node.js, Express
*   **CLI:** Yargs
*   **Logging:** Winston
*   **Data:** Axios, FS-Extra
*   **UI:** HTML5, Bootstrap 5
