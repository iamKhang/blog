// path: front-end/src/layouts/MainLayout.jsx
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer/footer';

MainLayout.propTypes = {
    children: PropTypes.element.isRequired,
  };
  

export default function MainLayout({children}) {
  return (
    <>
        <Header />
        {children}
        <Footer />
    
    </>
  )
}
