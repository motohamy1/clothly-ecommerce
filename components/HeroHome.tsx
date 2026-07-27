import React from 'react'
import BounceCards from './BounceCards'

function HomePage() {

    const images = [
        "/public/images/download(1).png",
        "/public/images/download(2).png",
        "/public/images/download(3).png",
        "/public/images/download(4).png"
    ]

    const transformStyles = [
        "rotate(5deg) translate(-150px)",
        "rotate(0deg) translate(-70px)",
        "rotate(-5deg)",
        "rotate(5deg) translate(70px)",
        "rotate(-5deg) translate(150px)"
    ];

    return (
        <div className='flex gap-20 h-screen items-center justify-center'>
            <BounceCards
                className='-translate-y-20 translate-x-80'
                images={images}
                containerWidth={400}
                containerHeight={400}
                animationDelay={0.5}
                animationStagger={0.06}
                easeType={'elastic.out(1, 0.8)'}
                transformStyles={transformStyles}
                enableHover={true}
            />
            <BounceCards
                className='translate-y-60'
                images={images}
                containerWidth={400}
                containerHeight={400}
                animationDelay={0.5}
                animationStagger={0.06}
                easeType={'elastic.out(1, 0.8)'}
                transformStyles={transformStyles}
                enableHover={true}
            />
            <BounceCards
                className='-translate-y-20 -translate-x-20'
                images={images}
                containerWidth={400}
                containerHeight={400}
                animationDelay={0.5}
                animationStagger={0.06}
                easeType={'elastic.out(1, 0.8)'}
                transformStyles={transformStyles}
                enableHover={true}
            />

        </div>
    )
}

export default HomePage