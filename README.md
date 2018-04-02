# Presidenciáveis Bot

Esse repositório é do bot: [@PresidentesBot](https://twitter.com/PresidentesBot/), que monitora edição de páginas ligadas a candidatos a presidência.

## Rodando

Para rodar você precisa seguir os passos:

1. Instalar o [Node](http://nodejs.org) (v6+)
1. `$ git clone https://github.com/highlabs/presidenciaveis_bot`
1. `$ cd presidenciaveis_bot`
1. `$ yarn install`
1. `$ cp twitter.config.example twitter.config.js`
1. Adicionar as credências do twitter em `twitter.config.js`
1. Adicionar páginas a monitorar em `pages.js`
1. `npm start`

### Páginas

Para monitorar as páginas basta adicionar novas URL em  `pages.js` assim:

`["https://en.wikipedia.org/wiki/Pa%C3%A7oca", "https://en.wikipedia.org/wiki/Brigadeiro"]`

### Fazendo deploy no [Now](https://zeit.co/now)

1. `$ now`

## License:

Copyright 2018 Highlabs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.