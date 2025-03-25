import * as THREE from "three";

export const pointsOfInterest = [
  {
    position: new THREE.Vector3(15, 35, 15),
    title: "Catedral da Sé",
    description: `
      A Catedral Metropolitana de Belém, ou simplesmente Catedral da Sé, é uma igreja católica de estilo neoclássico e barroco dedicada à Nossa Senhora da Graça (ou localmente conhecida como Santa Maria de Belém), localizada na cidade brasileira de Belém do Pará (Pará), construída em aproximadamente 1719. É também a primeira igreja construída na Regiao Norte do Brasil. Atualmente é sede da Arquidiocese de Belém e faz parte do conjunto arquitetônico, paisagístico e religioso do bairro Cidade Velha, denominado Feliz Lusitânia (núcleo colonial inicial da cidade).
    `,
    image: "/ponto1.jpg",
  },
  {
    position: new THREE.Vector3(-23, 8, -28),
    title: "Praça Dom Frei Caetano Brandão",
    description: `
  A Praça Dom Frei Caetano Brandão, inicialmente denominado Largo da Sé, fica localizada no bairro Cidade Velha na cidade brasileira de Belém, capital do estado do Pará.

A praça foi o ponto de partida do encontro entre colonos e indígenas, assim como da colonização de Belém e interior. Marco inicial da civilização, teve seu ápice durante o ciclo da borracha, enriquecendo e modernizando a sociedade belenense. Preserva em sua constituição traços históricos e culturais oriundos dos colonizadores portugueses e que determinaram o seu desenvolvimento.
    `,
    image: "/ponto2.jpg",
  },
];
