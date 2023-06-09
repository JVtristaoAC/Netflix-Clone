import React, { useEffect, useState} from 'react';
import './App.css'
import Tmdb from '../../api/Tmdb';
import MovieRow from '../../components/MovieRow';
import FeaturedMovie from '../../components/FeaturedMovie';
import Header from '../../components/Header';

export default () =>{
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  useEffect(()=>
    {
      const loadAll = async () => {

  
        let list = await Tmdb.getHomeList();
        setMovieList(list);
        
        let originals = await Tmdb.getListOriginals();
        let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
        let chosen = originals[0].items.results[randomChosen];
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
        
        
        setFeaturedData(chosenInfo);
      }
      loadAll();
    }, []);

    useEffect(() => {
      const scrollListener = () => {
        if(window.scrollY > 10)
          setBlackHeader(true)
        else
          setBlackHeader(false);
      }
      window.addEventListener('scroll', scrollListener);
      return () => {
        window.removeEventListener('scroll', scrollListener);
      }
    }, []);
    return (
      <div className='page'>
        <Header black={blackHeader}/>
        {featuredData && <FeaturedMovie item={featuredData}/>}
     
      <section className='lists'>
        {movieList.map((item, key) => (
             <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Feito por <a href='https://github.com/JVtristaoAC'>JVtristaoAC</a> com React.js 👨‍💻 <br/>
        Dados fornecidos pela API de <a href='https://www.themoviedb.org'>Tmdb.org</a> <br/>
        Direitos de imagem para Netflix 
      </footer>

      {movieList.length <= 0 &&
      <div className='loading'>
        <img src="https://blog.motionisland.com/wp-content/uploads/2022/03/Loading_1.gif"/>
      </div>
      }
      </div>
    );
}