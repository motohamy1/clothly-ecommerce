import React from 'react'
import BounceCards from './BounceCards'

function HomePage() {

    const images = [
        "/images/download%20(1).png",
        "/images/download%20(2).png",
        "/images/download%20(3).png",
        "/images/download%20(4).png"
    ]

    const transformStyles = [
        "rotate(5deg) translate(-150px)",
        "rotate(0deg) translate(-70px)",
        "rotate(-5deg)",
        "rotate(5deg) translate(70px)",
        "rotate(-5deg) translate(150px)"
    ];

    return (
        <div className='flex gap-20 h-[calc(100vh-8.5rem)] w-full items-center justify-center overflow-hidden'>
            <BounceCards
                className='-translate-y-20 translate-x-60'
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
                className='translate-y-50'
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
                className='-translate-y-60 -translate-x-40'
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