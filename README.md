# Hunger Games

Atividade desenvolvida para a disciplina de Inteligência Artificial Aplicada durante o semestre 2019.2

## Como Funciona?

Este jogo é composto de 4 elementos:

- <span style="color:black">**Arena**</span> : Tela de fundo aonde o jogo acontece.
- <span style="color:blue">Espécieme</span> : Indivíduo do jogo, sujeito aos conceitos de algoritmo genético para observar a evolução do comportamento das gerações aplicadas as regras do jogo.
- <span style="color:rgb(0,255,0)">Comida</span> : Elemento de recompensa do indivíduo.
- <span style="color:red">Veneno</span> : Elemento de punição do indivíduo.

![Hunger Games](figures/hungerGames.png)

Cada <span style="color:rgb(0,0,255)">espécieme</span> de uma dada geração está submetido as seguintes regras do jogo:

- Caso um indivíduo absorva uma <span style="color:rgb(0,255,0)">comida</span>, sua vida irá aumentar.
- Caso um indivíduo absorva um <span style="color:rgb(255,0,0)">veneno</span>, sua vida irá diminuir.
- Caso haja colisão entre indivíduos, o <span style="color:rgb(0,0,255)">espécieme</span> de maior vida irá absorver o indivíduo de menor vida. A vida do indivíduo maior irá aumentar de acordo com o valor da vida do indivíduo absorvido.

Cada <span style="color:rgb(0,0,255)">espécieme</span> é definido pelos seguintes atributos:

- **Posição**: Ponto (x,y) do <span style="color:rgb(0,0,255)">espécieme</span> na arena.
- **Velocidade**: Vetor que indica para onde o <span style="color:rgb(0,0,255)">espécieme</span> está se movendo.
- **Aceleração**: Vetor que indica o quanto a velocidade está variando.
- **Vida**: Pontuação do indivíduo.
- **Raio**: Tamanho do indivíduo, proporcional a sua vida.
- **Max Speed**
- **Max Force**

## Como um dado jogo evolui?

Primeiramente são criados
