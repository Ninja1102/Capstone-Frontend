import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carousel(){
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: "Welcome to UnitySpace",
            buttonText: "Check Stats",
            Navigate: '/home/profile'
        },
        {
            image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            title: "Discover Events",
            buttonText: "Browse Events",
            Navigate: 'events-section'
        },
        {
            image: "/src/assets/img1.jpg",
            title: "Schedule Meetings",
            buttonText: "Add Reminders", 
            Navigate: 'schedules-section'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === slides.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === slides.length - 1 ? 0 : prevSlide + 1
        );
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      };

    const handleNavigate = (path) => {
        navigate(`${path}`);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {slides.map((slide, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: index === currentSlide ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        transform: `translateX(${(index - currentSlide) * 100}%)`,
                        willChange: 'transform, opacity'
                    }}
                >
                    <img
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.7)',
                            willChange: 'transform'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '50px',
                        left: '50px',
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{slide.title}</h2>
                        <button
                            onClick={() => slide.image === slides[0].image ? handleNavigate(slide.Navigate) : scrollToSection(slide.Navigate)}
                            style={{
                                padding: '10px 25px',
                                fontSize: '1.1rem',
                                backgroundColor: '#ffffff',
                                color: 'black',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {slide.buttonText}
                        </button>
                    </div>
                </div>
            ))}
            
            <button 
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    zIndex: 1
                }}
            >
                ←
            </button>
            
            <button 
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.5)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    zIndex: 1
                }}
            >
                →
            </button>

            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                zIndex: 1
            }}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            border: 'none',
                            background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}