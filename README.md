# API con datos de Covid-19 en Twitter

![Estilo Código](https://github.com/enflujo/colev-twitter-api/actions/workflows/estilo-codigo.yml/badge.svg)
![Despliegue](https://github.com/enflujo/colev-twitter-api/actions/workflows/despliegue.yml/badge.svg)
![Tamaño](https://img.shields.io/github/repo-size/enflujo/colev-twitter-api?color=%235757f7&label=Tama%C3%B1o%20repo&logo=open-access&logoColor=white)
![Licencia](https://img.shields.io/github/license/enflujo/colev-twitter-api?label=Licencia&logo=open-source-initiative&logoColor=white)

## Instalación

```bash
# Iniciar contenedores
docker-compose up

# Instalar docker sin el log
docker-compose up -d

# Apagar contenedores
docker-compose down
```

## Desarrollo

Descargar este repositorio localmente:

```bash
git clone https://github.com/enflujo/colev-twitter-api
```

Instalar dependencias:

```bash
npm i
```

Correr servidor local:

```bash
npm run dev
```

## Servidores

Inicia un servidor local para ver la aplicación [http://localhost:3000](http://localhost:3000)

Inicia un servidor local para visualizar los datos guardados en MongoDB [http://localhost:8081/](http://localhost:8081/)

## Licencia

[MIT License](https://opensource.org/licenses/MIT).
