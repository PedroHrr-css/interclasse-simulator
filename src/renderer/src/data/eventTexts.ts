import type { MatchEventType } from '@/types'

type Templates = Record<MatchEventType, string[]>

export const eventTemplates: Templates = {
  gol: [
    '{jogador} recebe na área, gira e chuta no canto! GOOOOL do {time}!',
    'Que arrancada de {jogador}! Dribla dois e bate forte! É GOOOOL!',
    'Cobrança de falta caprichada de {jogador}. O goleiro nem se mexeu. GOOOOL!',
    '{jogador} aparece livre na segunda trave e empurra pra rede! GOOOL!',
    'GOOOOOL! {jogador} aproveita rebote e não perdoa! {time} marca!',
    'Cabeçada precisa de {jogador}! Que gol bonito! {time} está na frente!'
  ],
  chute_defendido: [
    '{jogador} arrisca de fora da área, mas o goleiro faz grande defesa!',
    'Finalização forte de {jogador}! O goleiro voa e manda pra escanteio!',
    '{jogador} tenta o gol, mas o defensor corta no último momento!',
    'Tentativa de {jogador}! A bola vai rente à trave!'
  ],
  falta: [
    '{jogador} sofre falta na entrada da área. Perigo para o {time}!',
    'Falta dura em {jogador}! O árbitro anota o infrator.',
    '{jogador} derrubado na corrida. Falta marcada.',
    'Falta cometida em {jogador} no meio-campo.'
  ],
  cartao_amarelo: [
    'Cartão amarelo para o adversário após falta em {jogador}!',
    'Reclamação excessiva resulta em cartão amarelo!',
    'Falta muito dura e o árbitro puxa o cartão amarelo!'
  ],
  cartao_vermelho: [
    'CARTÃO VERMELHO! Falta brutal! Time adversário fica com um a menos!',
    'Dois cartões amarelos para o mesmo jogador — está expulso!'
  ],
  escanteio: [
    '{jogador} lança na área, bola sai pela linha de fundo — escanteio!',
    'Escanteio para o {time} após defesa do goleiro.',
    '{jogador} cobra o escanteio, mas a defesa afasta!'
  ],
  chance_perdida: [
    '{jogador} fica cara a cara com o goleiro mas manda por cima! Que vacilo!',
    'Incrível! {jogador} estava livre mas o chute saiu pela linha lateral!',
    '{jogador} recebe passe açucarado mas hesita e perde a chance!',
    'Cabeçada de {jogador} vai rente à trave! Ufa, que susto!'
  ],
  defesa_goleiro: [
    'Defesa incrível do goleiro! {jogador} estava comemorando o gol!',
    'O goleiro voa no ângulo e salva o {time} de levar o gol!',
    'Que reflexo! O goleiro segura firme a finalização de {jogador}!'
  ],
  inicio_tempo: [
    '--- Apito do árbitro! Começa o {jogador} tempo! ---',
    '--- Bola rolando para o {jogador} tempo! ---'
  ],
  fim_tempo: [
    '--- Fim do {jogador} tempo! ---',
    '--- Intervalo! O placar parcial está definido. ---'
  ],
  fim_partida: [
    '--- APITO FINAL! A partida terminou! ---',
    '--- Fim de jogo! Obrigado, torcida! ---'
  ]
}

export function getEventText(tipo: MatchEventType, jogadorNome: string, timeNome: string): string {
  const templates = eventTemplates[tipo]
  const template = templates[Math.floor(Math.random() * templates.length)]
  return template
    .replace('{jogador}', jogadorNome)
    .replace('{time}', timeNome)
}
