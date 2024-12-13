# ITGMania Arena Mode Widgets

Stream widgets for ITGMania's Arena Mode.

## Running Locally

Install dependencies:

```
yarn
```

Create a .env file, make sure `VITE_WS_SERVER_URL` points to a valid websocket server.

Run the development server:

```
yarn dev
```

Open the application in your browser and follow the instructions to get the widget URL.

If a websocket server is running and you've defined a `VITE_DEBUG_ROUTE` environment variable, you can open that route in the application to send and receive websocket messages to the server.
