
import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class TabelaLivros extends Component {

    render() {
        return (
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Tílulo</th>
                    <th>Autor</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      this.props.lista.map(function(livro){
                          return (
                              <tr key={livro.id}>
                                  <td>{livro.titulo}</td>
                                  <td>{livro.autor.nome}</td>
                                  <td>{livro.preco}</td>
                              </tr>
                          );
                      })
                  }
                </tbody>
              </table> 
            </div>  
        );
    }
}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://5d1e76083374890014f00d8c.mockapi.io/livros",
            dataType: 'json',
            success: function(resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });

        PubSub.subscribe('atualiza-listagem-livros', function(topicao, novaLista){
            this.setState({lista:[...this.state.lista, novaLista]});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}