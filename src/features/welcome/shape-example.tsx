export function ShapeExample() {
  return (
    <figure className="shape-card" aria-label="Example star-shaped cycling route">
      <div className="shape-illustration">
        <svg viewBox="0 0 280 245" role="img" aria-label="A star-shaped route">
          <path
            d="M140 22 169 92 244 98 186 147 204 220 140 180 76 220 94 147 36 98 111 92Z"
            fill="none"
            stroke="#df694f"
            strokeWidth="3"
            strokeDasharray="6 7"
            strokeLinejoin="round"
          />
          <path
            d="M140 22 153 54 166 85 164 98 184 100 190 107 180 116 188 125 182 135 197 147 191 158 197 171 205 194 196 205 180 199 164 189 151 182"
            fill="none"
            stroke="#211f1c"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="140" cy="22" r="5" fill="#df694f" />
          <circle cx="151" cy="182" r="5" fill="#211f1c" />
        </svg>
      </div>
      <figcaption className="shape-caption">
        <span>Star · 10.1 km · New York</span>
        <span className="carousel-dots" aria-label="Example 2 of 3">
          <i /><i className="selected" /><i />
        </span>
      </figcaption>
    </figure>
  );
}
