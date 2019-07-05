
import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { lista: [], nome:'', email:'', senha:'' };
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();

        $.ajax({
            url: "http://5d1e76083374890014f00d8c.mockapi.io/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha}),
            success: function(resposta) {
                PubSub.publish('atualiza-listagem-autores', resposta);
            }, 
            error: function(resposta) {
                console.log('erro');
            }
        });
    }

    setNome(evento) {
        this.setState({nome:evento.target.value})
    }

    setEmail(evento) {
        this.setState({email:evento.target.value})
    }

    setSenha(evento) {
        this.setState({senha:evento.target.value})
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="POST">
              <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
              <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
              <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
              <div className="pure-control-group">                                  
                <label></label> 
                <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
              </div>
            </form>             
          </div>  
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>            
              <table className="pure-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>email</th>
                  </tr>
                </thead>
                <tbody>
                  {
                      this.props.lista.map(function(autor){
                          return (
                              <tr key={autor.id}>
                                  <td>{autor.nome}</td>
                                  <td>{autor.email}</td>
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

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "http://5d1e76083374890014f00d8c.mockapi.io/autores",
            dataType: 'json',
            success: function(resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        });

        PubSub.subscribe('atualiza-listagem-autores', function(topicao, novaLista){
            this.setState({lista:[...this.state.lista, novaLista]});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <FormularioAutor />
                <TabelaAutores lista={this.state.lista} />
            </div>
        );
    }
}