import type { KitConfig } from '@/types'

interface Props {
  kit: KitConfig
  size?: number
  numero?: number
}

export function KitCanvas({ kit, size = 120, numero = 10 }: Props) {
  const w = size
  const h = Math.round(size * 1.1)
  const { corPrimaria, corSecundaria, estilo, simbolo, corNumero } = kit

  const ShirtShape = () => (
    <path
      d={`
        M ${w * 0.18},${h * 0.18}
        L ${w * 0.05},${h * 0.35}
        L ${w * 0.22},${h * 0.40}
        L ${w * 0.22},${h * 0.88}
        L ${w * 0.78},${h * 0.88}
        L ${w * 0.78},${h * 0.40}
        L ${w * 0.95},${h * 0.35}
        L ${w * 0.82},${h * 0.18}
        Q ${w * 0.70},${h * 0.08} ${w * 0.58},${h * 0.10}
        Q ${w * 0.50},${h * 0.04} ${w * 0.42},${h * 0.10}
        Q ${w * 0.30},${h * 0.08} ${w * 0.18},${h * 0.18}
        Z
      `}
      fill={corPrimaria}
    />
  )

  const renderPattern = () => {
    if (estilo === 'solido') return null

    if (estilo === 'bicolor') {
      return (
        <rect
          x={w * 0.5}
          y={0}
          width={w}
          height={h}
          fill={corSecundaria}
          style={{ mixBlendMode: 'normal' }}
        />
      )
    }

    if (estilo === 'listra_v') {
      const stripes = [0.35, 0.5, 0.65]
      return (
        <>
          {stripes.map((x, i) => (
            <rect key={i} x={w * x} y={0} width={w * 0.07} height={h} fill={corSecundaria} />
          ))}
        </>
      )
    }

    if (estilo === 'listra_h') {
      const stripes = [0.35, 0.55, 0.72]
      return (
        <>
          {stripes.map((y, i) => (
            <rect key={i} x={0} y={h * y} width={w} height={h * 0.07} fill={corSecundaria} />
          ))}
        </>
      )
    }

    return null
  }

  const clipId = `shirt-clip-${size}`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ imageRendering: 'pixelated' }}>
      <defs>
        <clipPath id={clipId}>
          <path
            d={`
              M ${w * 0.18},${h * 0.18}
              L ${w * 0.05},${h * 0.35}
              L ${w * 0.22},${h * 0.40}
              L ${w * 0.22},${h * 0.88}
              L ${w * 0.78},${h * 0.88}
              L ${w * 0.78},${h * 0.40}
              L ${w * 0.95},${h * 0.35}
              L ${w * 0.82},${h * 0.18}
              Q ${w * 0.70},${h * 0.08} ${w * 0.58},${h * 0.10}
              Q ${w * 0.50},${h * 0.04} ${w * 0.42},${h * 0.10}
              Q ${w * 0.30},${h * 0.08} ${w * 0.18},${h * 0.18}
              Z
            `}
          />
        </clipPath>
      </defs>

      {/* Sombra */}
      <path
        d={`
          M ${w * 0.18},${h * 0.18}
          L ${w * 0.05},${h * 0.35}
          L ${w * 0.22},${h * 0.40}
          L ${w * 0.22},${h * 0.88}
          L ${w * 0.78},${h * 0.88}
          L ${w * 0.78},${h * 0.40}
          L ${w * 0.95},${h * 0.35}
          L ${w * 0.82},${h * 0.18}
          Q ${w * 0.70},${h * 0.08} ${w * 0.58},${h * 0.10}
          Q ${w * 0.50},${h * 0.04} ${w * 0.42},${h * 0.10}
          Q ${w * 0.30},${h * 0.08} ${w * 0.18},${h * 0.18}
          Z
        `}
        fill="#000"
        transform="translate(3,3)"
        opacity={0.4}
      />

      {/* Cor base */}
      <ShirtShape />

      {/* Padrão com clip */}
      <g clipPath={`url(#${clipId})`}>
        {renderPattern()}
      </g>

      {/* Borda pixel da camisa */}
      <path
        d={`
          M ${w * 0.18},${h * 0.18}
          L ${w * 0.05},${h * 0.35}
          L ${w * 0.22},${h * 0.40}
          L ${w * 0.22},${h * 0.88}
          L ${w * 0.78},${h * 0.88}
          L ${w * 0.78},${h * 0.40}
          L ${w * 0.95},${h * 0.35}
          L ${w * 0.82},${h * 0.18}
          Q ${w * 0.70},${h * 0.08} ${w * 0.58},${h * 0.10}
          Q ${w * 0.50},${h * 0.04} ${w * 0.42},${h * 0.10}
          Q ${w * 0.30},${h * 0.08} ${w * 0.18},${h * 0.18}
          Z
        `}
        fill="none"
        stroke="#000"
        strokeWidth={Math.max(2, size / 60)}
      />

      {/* Número */}
      <text
        x={w * 0.50}
        y={h * 0.68}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={corNumero}
        fontFamily="'Press Start 2P', monospace"
        fontSize={Math.round(w * 0.22)}
        stroke="#000"
        strokeWidth={Math.max(1, size / 80)}
        paintOrder="stroke"
      >
        {numero}
      </text>

      {/* Símbolo no peito */}
      <text
        x={w * 0.34}
        y={h * 0.38}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={corNumero}
        fontFamily="'Press Start 2P', monospace"
        fontSize={Math.round(w * 0.09)}
        stroke="#000"
        strokeWidth={1}
        paintOrder="stroke"
        opacity={0.9}
      >
        {simbolo}
      </text>
    </svg>
  )
}
