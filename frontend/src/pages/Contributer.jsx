import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contributer = () => {
  return (
    <div style={styles.page}>
      {/* Header */}
      <Header title="EkiView - Home" />

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.subContent}>
          <div style={styles.descriptionField}>
            <h4>Contributer to EkiView</h4>
          </div>
          <ul>
            <li>
              Riku Seino (<a href="https://github.com/RIKU-SEINO">GitHub</a>)
            </li>
            <li>

            <li>
              Minato Miyashita (<a href="https://github.com/miyashita-minato">GitHub</a>)
            </li>
                          
            <li>
              Daisuke Ikari (<a href="https://github.com/Daiikari">GitHub</a>)
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    textAlign: "center",
    marginTop: "60px",
  },
  subContent: {
    marginBottom: "30px",
    margin: "0 auto",
    width: "80%",
    textAlign: "left",
  },
  descriptionField: {
    marginBottom: "-20px",
  },
};

export default Contributer;
