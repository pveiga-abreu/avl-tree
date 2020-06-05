const No = require("./No")

class Arvore {
    constructor() {
        this.raiz = null;
        this.quantNos = 0;
        this.resultadoInserir = true;
    }


    // Verificar se o nó raiz atual é nulo
    isEmpty(_raiz) {
        return _raiz === null;
    }

    // Retorna o total de nós da Árvore
    size() {
        return this.quantNos;
    }

    // Limpar a Árvore
    limpar() {
        this.raiz = null;
    }


      ///////////////////
     // BALANCEAMENTO //
    ///////////////////

    rotacaoDireita(_raiz) {
        let _rFilho = _raiz.filhoEsq;
        let filhoDir_rFilho = _rFilho.filhoDir;

        _raiz.filhoEsq = filhoDir_rFilho;
        _rFilho.filhoDir = _raiz;

        if(_raiz.filhoEsq == null) {
            _raiz.hAE = 0;
        } else {
            if (_raiz.filhoEsq.hAE > _raiz.filhoEsq.hAD){
                _raiz.hAE = _raiz.filhoEsq.hAE + 1;
            }else{
                _raiz.hAE = _raiz.filhoEsq.hAD + 1;
            }

            if (_raiz.filhoDir.hAE > _raiz.filhoDir.hAD){
                _raiz.hAD = _raiz.filhoDir.hAE + 1;
            }else{
                _raiz.hAD = _raiz.filhoDir.hAD + 1;
            }
        }

        return _rFilho;
    }

    rotacaoEsquerda(_raiz) {
        let _rFilho = _raiz.filhoDir;
        let filhoEsq_rFilho = _rFilho.filhoEsq;

        _raiz.filhoDir = filhoEsq_rFilho;
        _rFilho.filhoEsq = _raiz;

        if(_raiz.filhoDir == null) {
            _raiz.hAD = 0;
        } else {
            if (_raiz.filhoEsq.hAE > _raiz.filhoEsq.hAD){
                _raiz.hAE = _raiz.filhoEsq.hAE + 1;
            }else{
                _raiz.hAE = _raiz.filhoEsq.hAD + 1;
            }

            if (_raiz.filhoDir.hAE > _raiz.filhoDir.hAD){
                _raiz.hAD = _raiz.filhoDir.hAE + 1;
            }else{
                _raiz.hAD = _raiz.filhoDir.hAD + 1;
            }
        }

        return _rFilho;
    }

    balanceamento(_raiz) {
        const FB = _raiz.hAD - _raiz.hAE; // Fator de balanceamento
        let filhoFB; // Fator de Balanceamento do filho 

        if(FB === 2) {
            filhoFB = _raiz.filhoDir.hAD - _raiz.filhoDir.hAE;
        
            if(filhoFB >= 0) {
                // Rotação Simples
                _raiz = this.rotacaoEsquerda(_raiz);

            } else {
                // Rotação Dupla
                _raiz.filhoDir = this.rotacaoDireita(_raiz.filhoDir);
                _raiz = this.rotacaoEsquerda(_raiz);

            }
        
        } 
        else if(FB === -2) {
            filhoFB = _raiz.filhoEsq.hAD - _raiz.filhoEsq.hAE;

            if(filhoFB <= 0) {
                // Rotação Simples
                _raiz = this.rotacaoDireita(_raiz);

            } else {
                // Rotação Dupla
                _raiz.filhoEsq = this.rotacaoEsquerda(_raiz.filhoEsq);
                _raiz = this.rotacaoDireita(_raiz);

            }
        }
    
        return _raiz;
    }

    // Método para atualizar as alturas das subárvores
    atualizacao(_raiz) {
        // Verificar se a raiz não está vazia
        if(!this.isEmpty(_raiz)) {
            _raiz.filhoEsq = this.atualizacao(_raiz.filhoEsq);
            if(_raiz.filhoEsq === null) {
                _raiz.hAE = 0;
            } else {
                if(_raiz.filhoEsq.hAE > _raiz.filhoEsq.hAD) {
                    _raiz.hAE = _raiz.filhoEsq.hAE + 1;
                } else {
                    _raiz.hAE = _raiz.filhoEsq.hAD + 1;
                }
            }

            _raiz.filhoDir = this.atualizacao(_raiz.filhoDir);
            if(_raiz.filhoDir === null) {
                _raiz.hAD = 0;
            } else {
                if(_raiz.filhoDir.hAE > _raiz.filhoDir.hAD) {
                    _raiz.hAD = _raiz.filhoDir.hAE + 1;
                } else {
                    _raiz.hAD = _raiz.filhoDir.hAD + 1;
                }
            }

            // Realiza o balanceamento da árvore
            _raiz = this.balanceamento(_raiz);
        }

        return _raiz;
    }


      //////////////
     // INSERÇÃO //
    //////////////

    // Método para comparar o nó atual, com o valor a ser inserido
    compara(_raiz, _valor) {
        if (_valor < _raiz.valor)
            return -1; // Inserir a esquerda
        else if (_valor > _raiz.valor)
            return 1; // Inserir a direita
        else
            return 0; // Não pode inserir o valor
    }

    // Método recursivo para verificar a inserção dos dados
    __inserir(_raiz, _valor) {
        
        if (this.isEmpty(_raiz)) {
            _raiz = new No(_valor); // Insere o novo nó na raiz 
            this.quantNos++;
        } else {
            const compare = this.compara(_raiz, _valor);
            
            if(compare === -1) {
                // Insere a esquerda
                _raiz.filhoEsq = this.__inserir(_raiz.filhoEsq, _valor);
            }
            else if (compare === 1) {
                // Insere a Direita
                _raiz.filhoDir = this.__inserir(_raiz.filhoDir, _valor);
            }
            else {
                this.resultadoInserir = false;
            }
        }
  
        return _raiz;
    }

    // Método para inserir um dado na árvore
    inserir(_valor){
        // Registra o último endereço retornado.
        this.raiz = this.__inserir(this.raiz, _valor);

        // Atualizar a altura das subárvores
        this.raiz = this.atualizacao(this.raiz);

        return this.resultadoInserir;
    }


      ///////////////
     //  REMOÇÃO  //
    ///////////////

    // Método para identificar o nó mais à esquerda de uma subárvore
    maisAEsquerda(_raiz) {
        let endereco = null;

        if( _raiz != null) {
            if(_raiz.filhoEsq == null) {
                endereco = _raiz;
            } else {
                endereco = this.maisAEsquerda(_raiz.filhoEsq);
            }
        }

        return endereco;
    }
    
    // Método para identificar o nó mais à direita de uma subárvore
    maisADireita(_raiz) {
        let endereco = null;

        if( _raiz != null) {
            if(_raiz.filhoDir == null) {
                endereco = _raiz;
            } else {
                endereco = this.maisADireita(_raiz.filhoDir);
            }
        }

        return endereco;
    }

    // Método recursivo para verificar a remoção de um dado da árvore
    __remover(_raiz, _valor) {
        let substituto;

        if(_raiz !== null) {

            if(_valor === _raiz.valor) {
                // Caso a remoção seja de um nó folha
                if(_raiz.filhoEsq === null && _raiz.filhoDir === null) {
                    _raiz = null;
                }
                // Caso o nó tenha filhos
                else if (_raiz.filhoEsq !== null) {
                    substituto = this.maisADireita(_raiz.filhoEsq);
                    _raiz.valor = substituto.valor;
                    _raiz.filhoEsq = this.__remover(_raiz.filhoEsq, substituto.valor);
                }
                else {
                    substituto = this.maisAEsquerda(_raiz.filhoDir);
                    _raiz.valor = substituto.valor;
                    _raiz.filhoDir = this.__remover(_raiz.filhoDir, substituto.valor);
                }
            } else {
                // Avançar para o próximo nó
                if(_valor < _raiz.valor) {
                    _raiz.filhoEsq = this.__remover(_raiz.filhoEsq, _valor);
                } else if(_valor > _raiz.valor) {
                    _raiz.filhoDir = this.__remover(_raiz.filhoDir, _valor);
                }
            }
        }

        return _raiz;
    }

    // Método para remover um dado da árvore
    remover(_valor) {
        if(this.pesquisar(_valor)) {
            this.raiz = this.__remover(this.raiz, _valor);
            this.quantNos--;
        }
    }


      ///////////////
     //  PESQUISA //
    ///////////////

    // Método para pesquisar na árvore
    pesquisar(_valor, _raiz=this.raiz) {

        //Verificar se a raiz atual é nula
        if(!this.isEmpty(_raiz)) {
            // Verificar os valores
            if(_valor === _raiz.valor) {
                return true;
            }
            else if(_valor < _raiz.valor) {
                return this.pesquisar(_valor, _raiz.filhoEsq);
            }   
            else if(_valor > _raiz.valor) { 
                return this.pesquisar(_valor, _raiz.filhoDir);
            }
        }

        return false;
    }

}

module.exports = Arvore;
