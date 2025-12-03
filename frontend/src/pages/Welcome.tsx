import WelcomeHeader from '../components/HomeComponents/WelcomeComponents/WelcomeHeader'
import '../components/HomeComponents/WelcomeComponents/WelcomeBody.css'
import imgAoi from '../assets/img/WelcomeIMG/IMG_aoi.jpeg'
import imgKai from '../assets/img/WelcomeIMG/IMG_kai.jpeg'
import imgmei from '../assets/img/WelcomeIMG/IMG_mei.jpeg'
function Welcome() {
  return (
    <>
        <WelcomeHeader />
        <div className="body">
          <br />
          <div>自分のProfileサイトを作ろう</div>
          <br /><br />
            <ul className="sample-img">
                <li>
                  <a href="https://profiu.me/user/aoi0216" target="_blank" rel="noopener noreferrer">
                    <img src={imgAoi} alt="あおいさんの紹介ページ画像" />
                  </a>
                </li>
                <li>
                  <a href="https://profiu.me/user/mei0921" target="_blank" rel="noopener noreferrer">
                    <img src={imgmei} alt="めいさんの紹介ページ画像" />
                  </a>
                </li>
                <li>
                  <a href="https://profiu.me/user/kai0306" target="_blank" rel="noopener noreferrer">
                    <img src={imgKai} alt="かいさんの紹介ページ画像" />
                  </a>
                </li>

            </ul>
        </div>
        
        
    </>

  )
}

export default Welcome