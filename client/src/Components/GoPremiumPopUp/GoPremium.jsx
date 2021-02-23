import React from 'react';
import Popup from 'reactjs-popup';
import style from './GoPremium.module.css';
import Verified from '../../Media/Verification.png';
import axios from 'axios';

function GoPremium() {

    return (
        <Popup trigger={<button id={style.goPremiumBtn}>Go premium</button>} modal>
            {close => (
                <div id={style.mainDiv} onClick={close}>
                    <div id={style.form}>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <h1 id={style.titleGP}>Get verified and become a premium member!</h1>
                        </div>
                        <div className='displayFlex' id='alignItemsCenter'>
                            <div id={style.firstDiv}>
                                <span className={style.pro}>🧑‍💻 Join the community and<span className='font800'> get the boost your career as a developer or your startup needs.</span></span>
                                <div className={style.pro}>
                                    <img src={Verified} id={style.icon} />
                                    <span>Verify yourself and be the first person project founders see when they are looking for developers, by <span className='font800'>appearing on the frontpage of the workers directory.</span></span>
                                </div>
                                <span className={style.pro}>🚀 <span className='font800'>Eliminate the limit of projects that you can publish</span>, so you will have the opportunity to promote any idea you have.</span>
                                <span className={style.pro}>🔥 Any work you post will have the FindDevs check mark <span className='font800'>(4x more visits and applicants) and will appear on the top of the published work directory</span>.</span>
                            </div>
                            <div>
                                <div id={style.price}>
                                    <span className='font800'>$11.99</span>
                                    <span className={style.advert}>7-day money-back guarantee. One time payment.</span>
                                </div>
                            </div>
                        </div>
                        <div id={style.paymentDiv}>
                            <span id={style.advertPay}>Make sure that the email you put in the checkout is the same that you used to register in FindDevs.</span>
                            <button id={style.btn}>Go premium</button>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    )
}
export default GoPremium;