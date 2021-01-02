# Projekt strony WWW hurtowni książek
## Usage

1.  Clone the repository:
    ```sh
    git clone https://github.com/bittersweetshimmer/hurtownia-ksiazek
    cd hurtownia-ksiazek
    ```
2.  Copy `.env.example` file into `.env` and adjust variables accordingly,
3.  Run the server:
    -   using [Node.js](https://nodejs.org/en/download/) _(tested on v15.3.0)_:
        ```sh
        npm install
        npm run migrate # updates existing database or creates it 
        npm run server
        ```
    -   using [Docker](https://www.docker.com/):
        ```sh
        docker build -t hurtownia-ksiazek .
        docker run -p 8080:8080 -d hurtownia-ksiazek
        ```
4.  Open your browser at `http://127.0.0.1:8080` _(or whatever you have assigned in the `.env` file)_.