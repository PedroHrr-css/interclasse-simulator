export const primeiros = [
  'Gabriel', 'Lucas', 'Mateus', 'Rafael', 'Pedro', 'Guilherme', 'Felipe', 'Henrique',
  'Thiago', 'Bruno', 'Rodrigo', 'Diego', 'André', 'Carlos', 'Eduardo', 'Leonardo',
  'Gustavo', 'Vitor', 'Igor', 'Caio', 'Arthur', 'Murilo', 'Vinícius', 'Kaique',
  'Wesley', 'Danilo', 'Leandro', 'Marcelo', 'Ricardo', 'Daniel', 'Paulo', 'Enzo',
  'Luan', 'Davi', 'Samuel', 'João', 'Nicolas', 'Ryan', 'Yago', 'Alex'
]

export const sobrenomes = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Ferreira',
  'Rodrigues', 'Alves', 'Nascimento', 'Carvalho', 'Gomes', 'Martins', 'Araújo',
  'Melo', 'Barbosa', 'Ribeiro', 'Monteiro', 'Mendes', 'Freitas', 'Nunes', 'Rocha',
  'Cardoso', 'Teixeira', 'Moreira', 'Lopes', 'Vieira', 'Azevedo', 'Castro'
]

export const apelidos = [
  'Bola de Ouro', 'Relâmpago', 'Canela de Ferro', 'Ratão', 'Bombinha', 'Frechinha',
  'Cavalo', 'Tubarão', 'Barba', 'Polvo', 'Elefante', 'Esqueleto', 'Metralhadora',
  'Pistola', 'Cobra', 'Gavião', 'Paixão', 'Furacão', 'Vulcão', 'Locomotiva'
]

export const series = ['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C']

export const cidades = [
  { cidade: 'São Paulo', estado: 'SP' },
  { cidade: 'Rio de Janeiro', estado: 'RJ' },
  { cidade: 'Belo Horizonte', estado: 'MG' },
  { cidade: 'Curitiba', estado: 'PR' },
  { cidade: 'Porto Alegre', estado: 'RS' },
  { cidade: 'Salvador', estado: 'BA' },
  { cidade: 'Fortaleza', estado: 'CE' },
  { cidade: 'Recife', estado: 'PE' },
  { cidade: 'Manaus', estado: 'AM' },
  { cidade: 'Brasília', estado: 'DF' }
]

export const prefixosEscolasPublicas = [
  'EMEF', 'EE', 'EEPSG', 'CEFET', 'ETEC', 'CEMEF'
]

export const nomesEscolasPublicas = [
  'José Bonifácio', 'Santos Dumont', 'Getúlio Vargas', 'Anchieta', 'Dom Pedro II',
  'Tiradentes', 'Rui Barbosa', 'Oswaldo Cruz', 'Monteiro Lobato', 'Carlos Gomes',
  'Visconde de Cairu', 'Padre Anchieta', 'Dom Bosco', 'Maria Montessori'
]

export const nomesEscolasParticulares = [
  'Objetivo', 'COC', 'Pitágoras', 'Marista', 'Dom Bosco', 'Salesiano',
  'Eliezer', 'Champagnat', 'Einstein', 'Newton', 'Galileu', 'Leonardo da Vinci',
  'São José', 'Santa Maria', 'Notre Dame', 'Anglo'
]

export function nomeAleatorio(): string {
  const p = primeiros[Math.floor(Math.random() * primeiros.length)]
  const s = sobrenomes[Math.floor(Math.random() * sobrenomes.length)]
  return `${p} ${s}`
}

export function apelidoAleatorio(): string | undefined {
  if (Math.random() < 0.25) {
    return apelidos[Math.floor(Math.random() * apelidos.length)]
  }
  return undefined
}
