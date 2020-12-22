# Projekt strony WWW hurtowni książek
## Usage

1.  Clone the repository:
    ```sh
    git clone https://github.com/bittersweetshimmer/hurtownia-ksiazek
    cd hurtownia-ksiazek
    ```
2.  Run the server:
    -   using [Node.js](https://nodejs.org/en/download/):
        ```sh
        npm install
        npm run migrate
        npm run server
        ```
    -   using [Docker](https://www.docker.com/):
        ```sh
        docker build -t hurtownia-ksiazek .
        docker run -p 8080:8080 -d hurtownia-ksiazek
        ```
3.  Open your browser at `http://127.0.0.1:8080`.