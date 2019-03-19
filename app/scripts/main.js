function scrollToTop(event) {
    event.preventDefault();
    window.scroll({
        top: 0, 
        behavior: 'smooth'
      });
}

document.querySelector('.titletag a').addEventListener('click', () => {scrollToTop(event)});