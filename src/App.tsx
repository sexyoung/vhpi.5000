import React, { useEffect, useState } from "react";

import style from './App.module.css';

import domesticTravel from './images/domesticTravel.png';
import iYuan from './images/iYuan.png';
import agriculture from './images/agriculture.png';
import artFunE from './images/artFunE.png';
import artFunP from './images/artFunP.png';
import sports from './images/sports.png';
import hakka from './images/hakka.png';
import rgionalRevitalization from './images/rgionalRevitalization.png';

const nameMapping = {
  domesticTravel: '國旅券',
  iYuan: 'i原券',
  agriculture: '農遊券',
  artFunE: '藝Fun券(數位)',
  artFunP: '藝Fun券(紙本)',
  sports: '動滋券',
  hakka: '客庄券',
  rgionalRevitalization: '地生創生券',
}

const linkMapping = {
  domesticTravel: 'https://1000.taiwan.net.tw/',
  iYuan: 'https://explorethesun.tw/cipshop/',
  agriculture: 'https://888.coa.gov.tw/',
  artFunE: 'https://artsfunnext.moc.gov.tw/',
  artFunP: 'https://artsfunnext.moc.gov.tw/',
  sports: 'https://500.gov.tw/',
  hakka: 'http://www.hakka500.tw/',
  rgionalRevitalization: 'https://www.twrr.ndc.gov.tw/',
}

const dateMapping = {
  // domesticTravel: '星期五',
  domesticTravel: ['10/15', '10/22', '10/29', '11/05'],
  agriculture: '10/25',
}

const valueMapping = {
  domesticTravel: '1000',
  iYuan: '1000',
  agriculture: '888',
  artFunE: '600',
  artFunP: '600',
  sports: '500',
  hakka: '500',
  rgionalRevitalization: '500',
}

const images = {
  domesticTravel,
  iYuan,
  agriculture,
  artFunE,
  artFunP,
  sports,
  hakka,
  rgionalRevitalization,
}

type Prize = {
  domesticTravel: string[];
  iYuan: string[];
  agriculture: string[];
  artFunE: string[];
  artFunP: string[];
  sports: string[];
  hakka: string[];
  rgionalRevitalization: string[];
}

const App: React.FC = () => {
  const [disabled, setDisabled] = useState(true);
  const [codeList, setCodeList] = useState<Prize[]>([]);
  const [resultList, setResultList] = useState<string[]>();
  useEffect(() => {
    // get code json
    fetch('//vhpi-5000-api.sexyoung.tw').then(res => res.json()).then(setCodeList);
  }, []);

  const findPrize = (code: string) => {
    const result: string[] = [];
  
    codeList.forEach((week, index) => {
      Object.keys(week).forEach(prizeType => {
        week[prizeType as keyof typeof week].forEach(prize => {
          const r = RegExp(`${prize}$`);
          if(r.test(code)) result.push(`${index + 1}-${prizeType}`);
        });
      });
    });
  
    setResultList(result);
  
    (document.getElementById('code') as HTMLInputElement).value = '';
  }

  const handleDate = (date: any) => {
    if ((date !== undefined || date) && new Date() < new Date('2021/' + date)) {
        return `(${date} 領券)`
      }
    }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    findPrize((document.getElementById('code') as HTMLInputElement).value);
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setDisabled(currentTarget.value.length < 2);
    if(currentTarget.value.length === 3) {
      findPrize(currentTarget.value);
    }
  }


  if(!codeList.length) return null;

  return (
    <div className={style.App}>
      <div className={style.logo} />
      <div className={style.text}>身份證加碼查</div>
      <small>非官方，加碼券得獎請看<a href="https://vhpi.5000.gov.tw/" target="_blank" rel="noreferrer">振興五倍券官網</a></small>
      <form onSubmit={handleSubmit}>
        <div>請輸入後三碼查詢</div>
        <input type="tel" id="code" maxLength={3} onChange={handleChange} />
        <button disabled={disabled}>查詢</button>
      </form>
      {resultList ?
        <div className={style.resultList}>
          {resultList.length ?
            <div className={style.result}>
              <div className={style.title}>Wooow 中獎了</div>
              {resultList.map((result, index) =>
                <div key={index} className="result">

                  第{result.split('-')[0]}期{nameMapping[result.split('-')[1] as keyof typeof nameMapping]}<br />
                  {/* {handleDate(dateMapping[result.split('-')[1] as keyof typeof dateMapping])} */}
                  { handleDate(result.split('-')[1] === 'domesticTravel' ?
                      dateMapping[result.split('-')[1] as keyof typeof dateMapping][Number(result.split('-')[0])-1] :
                      dateMapping[result.split('-')[1] as keyof typeof dateMapping])
                  }
                  ({valueMapping[result.split('-')[1] as keyof typeof valueMapping]}元)

                  <a href={linkMapping[result.split('-')[1] as keyof typeof linkMapping]} target="_blank" rel="noreferrer">
                    <img alt="prize" src={images[result.split('-')[1] as keyof typeof images]} />
                  </a>
                </div>
              )}
            </div>:
            <div className={style.result}>沒中獎</div>
          }
        </div>
        :null
      }
    </div>
  );
}

export default App;
