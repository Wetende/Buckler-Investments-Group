import React, { memo } from 'react'

// Libraries
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { PropTypes } from "prop-types";

// Components
import SocialIcons from '../SocialIcon/SocialIcons';
import FooterMenu, { Footer } from './Footer';
import StaticInstagram from '../Instagram/StaticInstagram';

// Data
import FooterData from './FooterData';

// Localization
const localize = (key, language = 'en') => {
    const locales = {
        en: {
            getInTouch: 'Get in touch',
            followInstagram: 'Follow us on Instagram',
            followInstagramLink: 'Follow instagram',
            copyright: 'Buckler Investment Group. All rights reserved.',
            address: 'Westlands, Nairobi, Kenya - East Africa',
            phone: '+254 700 000 000',
            email: 'info@buckler.co.ke'
        },
        sw: {
            getInTouch: 'Wasiliana nasi',
            followInstagram: 'Tufuate kwenye Instagram',
            followInstagramLink: 'Fuata instagram',
            copyright: 'Buckler Investment Group. Haki zote zimehifadhiwa.',
            address: 'Westlands, Nairobi, Kenya - Afrika Mashariki',
            phone: '+254 700 000 000',
            email: 'info@buckler.co.ke'
        }
    };

    return locales[language]?.[key] || locales.en[key] || key;
};

const iconData = [
    {
        color: "#828282",
        link: "https://www.facebook.com/",
        icon: "fab fa-facebook-f"
    },
    {
        color: "#828282",
        link: "https://dribbble.com/",
        icon: "fab fa-dribbble"
    },
    {
        color: "#828282",
        link: "https://twitter.com/",
        icon: "fab fa-twitter"
    },
    {
        color: "#828282",
        link: "https://www.instagram.com/",
        icon: "fab fa-instagram"
    },
]

const FooterStyle01 = (props) => {
    const language = props.language || 'en';
    return (
        <Footer theme={props.theme} className={`${props.className ? ` ${props.className}` : ""}`}>
            <div className="py-[5%] lg:py-[95px] md:py-[50px]">
                <Container>
                    <Row>
                        <FooterMenu data={FooterData.slice(0, 3)} lg={3} sm={6} className="xl:px-[15px] md:mb-[40px] xs:mb-[25px]" titleClass="capitalize" />
                        <Col lg={3} sm={6} className="xs:mb-[25px]">
                            <span className="mb-[20px] font-serif block font-medium text-themecolor xs:mb-[10px]">{localize('getInTouch', language)}</span>
                            <p className="w-[85%] mb-[15px]">{localize('address', language)}</p>
                            <div><i className="feather-phone-call text-sm mr-[10px] text-themecolor"></i>{localize('phone', language)}</div>
                            <div><i className="feather-mail text-sm mr-[10px] text-themecolor"></i><a aria-label="mail" href={`mailto:${localize('email', language)}`}>{localize('email', language)}</a></div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="py-[40px] border-t border-[#ffffff1a]">
                <Container>
                    <Row>
                        <Col md={3} className="sm:mb-[20px]">
                            <Link aria-label="homepage" to="/" className="sm:flex sm:justify-center">
                                <h3 className="text-white font-serif font-bold text-xl hover:text-themecolor transition-all duration-300">
                                    Buckler Investment Group
                                </h3>
                            </Link>
                        </Col>
                        <Col md={6} className="flex justify-center items-center text-center sm:mb-[20px]">
                            <p className="mb-0">&copy; {new Date().getFullYear()} {localize('copyright', language)}</p>
                        </Col>
                        <Col md={3} className="text-right sm:text-center">
                            <SocialIcons size="xs" theme="social-icon-style-01" className="justify-end sm:justify-center" iconColor={props.theme === "dark" ? "light" : "dark"} data={iconData} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </Footer>
    )
}

FooterStyle01.defaultProps = {
    data: FooterData,
    className: "bg-darkgray text-[#828282]",
    logo: "/assets/img/webp/logo-white.webp",
    theme: "light",
    language: "en"
}

FooterStyle01.propTypes = {
    className: PropTypes.string,
    logo: PropTypes.string,
    theme: PropTypes.string,
    language: PropTypes.string
}

export default memo(FooterStyle01)
