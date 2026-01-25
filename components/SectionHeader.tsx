interface SectionHeaderProps {
  tag: string
  title: string
  highlight: string
}

export default function SectionHeader({ tag, title, highlight }: SectionHeaderProps) {
  return (
    <div className="section-header reveal">
      <span className="section-tag">{tag}</span>
      <h2 className="section-title">
        {title}
        <span className="highlight">{highlight}</span>
      </h2>
      <div className="title-decoration">
        <span className="deco-line"></span>
        <span className="deco-diamond">◆</span>
        <span className="deco-line"></span>
      </div>
    </div>
  )
}
