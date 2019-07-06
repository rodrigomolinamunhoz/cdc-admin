
import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = { lista: [], titulo:'', preco:'', autorId:'', autor:{} };
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
        this.setAutor = this.setAutor.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();

        $.ajax({
            url: "http://5d1e76083374890014f00d8c.mockapi.io/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId}),
            success: function(resposta) {
                PubSub.publish('atualiza-listagem-livros', resposta);
                this.setState({titulo:'', preco:'', autorId:'', autor:{} })
            }.bind(this), 
            error: function(resposta) {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function() {
                PubSub.publish('limpa-erros', {});
            }
        });
    }

    setTitulo(evento) {
        this.setState({titulo:evento.target.value})
    }

    setPreco(evento) {
        this.setState({preco:evento.target.value})
    }

    setAutorId(evento) {
        this.setState({autorId:evento.target.value})
    }

    setAutor(evento) {
        this.setState({autor:evento.target.value})
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Título" />
                    <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço" />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label> 
                        <select name="autorId" id="autorId" onChange={this.setAutorId}>
                            <option value="">Selecione</option>
                            {
                                this.props.autores.map(function(autor){
                                    return <option value={autor.id}>{autor.nome}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="pure-control-group">                                  
                        <label></label> 
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                    </div>
                </form>             
            </div>  
        );
    }
}

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
        this.state = { lista: [], autores: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://5d1e76083374890014f00d8c.mockapi.io/livros",
            dataType: 'json',
            success: function(resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });

        $.ajax({
            url: "http://5d1e76083374890014f00d8c.mockapi.io/autores",
            dataType: 'json',
            success: function(resposta) {
                this.setState({ autores: resposta });
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
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        );
    }
}