# Presidenciáveis Bot

Esse repositório é um fork do [anon](https://github.com/edsu/anon), com algumas modificações.

Em vez de monitorar um range de IP ele monitora páginas de presidenciáveis e relacionados.

## Rodando

Para rodar você precisa seguir os passos:

1. Instalar o [Node](http://nodejs.org) (v6+)
1. `$ git clone https://github.com/highlabs/presidenciaveis_bot`
1. `$ cd presidenciaveis_bot`
1. `$ npm install`
1. `$ cp config.json.template config.json`
1. Adicionar as credências do twitter em `config.json`
1. Adicionar páginas a monitorar em `pages.json`
1. `./anon.js`

### Páginas

Para monitorar as páginas basta adicionar novas URL em  `pages.json` assim:

`["https://en.wikipedia.org/wiki/Pa%C3%A7oca", "https://en.wikipedia.org/wiki/Brigadeiro"]`

### Fazendo deploy no heroku

Depois de se registrar no heroku e baixar o [cli](https://devcenter.heroku.com/articles/heroku-cli)

1. `$ heroku create`
1. `$ git push heroku master`

Apenas na primeira vez você precisará rodar o comando: `$ heroku scale web=0 worker=1` para rodar o script.

## License:

* [CC0](LICENSE) public domain dedication
