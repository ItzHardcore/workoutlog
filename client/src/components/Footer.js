import React from 'react';
import { FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light text-center mt-auto">
      <div className="container">
        <h5 className="mt-3">Made for learning and self purposes! 📚🤓</h5>
        <h5 className="mt-3">
          <a className='link-secondary link-offset-2 text-decoration-none' href="https://github.com/itzHardcore" target="_blank" rel="noopener noreferrer">
            <FaGithub /> Check my Github ❤️
          </a>
        </h5>
      </div>
    </footer>
  );
}

export default Footer;
