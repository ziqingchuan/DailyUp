import '../styles/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {currentYear} DailyUp · 让工作记录更简单
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
