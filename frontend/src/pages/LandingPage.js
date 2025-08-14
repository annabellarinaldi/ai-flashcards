// frontend/src/pages/LandingPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    useEffect(() => {
        // Smooth scrolling for anchor links
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll effect to navbar
        const handleScroll = () => {
            const navbar = document.querySelector('.landing-navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        const animatedElements = document.querySelectorAll('.benefit-card, .feature-card, .step');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            anchors.forEach(anchor => {
                anchor.removeEventListener('click', handleScroll);
            });
        };
    }, []);

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-navbar">
                <div className="landing-nav-container">
                    <div className="landing-nav-logo">🐢 Testudo</div>
                    <div className="landing-nav-buttons">
                        <button onClick={handleLoginClick} className="landing-nav-btn login">
                            Login
                        </button>
                        <button onClick={handleSignUpClick} className="landing-nav-btn signup">
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="landing-hero-section">
                <div className="landing-hero-content">
                    <div className="landing-hero-text">
                        <h1 className="landing-hero-title">
                            <span className="landing-turtle-emoji">🐢</span>
                            Study Smarter with <span className="landing-brand-name">Testudo</span>
                        </h1>
                        <p className="landing-hero-subtitle">
                            AI-powered flashcards that adapt to your learning pace using proven spaced repetition
                        </p>
                        <div className="landing-hero-buttons">
                            <button onClick={handleSignUpClick} className="landing-cta-primary">
                                Start Learning Free
                            </button>
                            <button onClick={handleLoginClick} className="landing-cta-secondary">
                                Already have an account?
                            </button>
                        </div>
                    </div>
                    <div className="landing-hero-visual">
                        <div className="landing-flashcard-demo">
                            <div className="landing-demo-card">
                                <div className="landing-demo-term">Photosynthesis</div>
                                <div className="landing-demo-definition">The process by which plants convert sunlight into energy</div>
                            </div>
                            <div className="landing-floating-elements">
                                <div className="landing-float-element">🧠</div>
                                <div className="landing-float-element">⚡</div>
                                <div className="landing-float-element">📚</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SRS Benefits Section */}
            <section className="landing-srs-section">
                <div className="landing-section-container">
                    <h2 className="landing-section-title">Why Spaced Repetition Works</h2>
                    <p className="landing-section-subtitle">
                        Science-backed learning that helps you remember more with less effort
                    </p>
                    
                    <div className="landing-benefits-grid">
                        <div className="benefit-card">
                            <div className="landing-benefit-icon">🧠</div>
                            <h3>Optimizes Memory</h3>
                            <p>Reviews cards just before you're about to forget them, strengthening long-term retention by up to 90%</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="landing-benefit-icon">⏰</div>
                            <h3>Saves Time</h3>
                            <p>Focus only on what you need to review. No wasted time on material you already know well</p>
                        </div>
                        
                        <div className="benefit-card">
                            <div className="landing-benefit-icon">📈</div>
                            <h3>Proven Results</h3>
                            <p>Based on decades of cognitive science research. Used by medical students, language learners, and professionals worldwide</p>
                        </div>
                    </div>

                    <div className="landing-srs-explanation">
                        <div className="landing-srs-visual">
                            <div className="landing-timeline">
                                <div className="landing-timeline-point active">
                                    <span className="landing-point-label">Day 1</span>
                                    <span className="landing-point-desc">Learn</span>
                                </div>
                                <div className="landing-timeline-point">
                                    <span className="landing-point-label">Day 3</span>
                                    <span className="landing-point-desc">Review</span>
                                </div>
                                <div className="landing-timeline-point">
                                    <span className="landing-point-label">Week 2</span>
                                    <span className="landing-point-desc">Review</span>
                                </div>
                                <div className="landing-timeline-point">
                                    <span className="landing-point-label">Month 1</span>
                                    <span className="landing-point-desc">Review</span>
                                </div>
                            </div>
                        </div>
                        <div className="landing-srs-text">
                            <h3>How It Works</h3>
                            <p>
                                Testudo uses the same algorithm trusted by millions of learners. Each time you correctly recall a flashcard, 
                                the interval before the next review increases. Struggle with a card? It comes back sooner. 
                                This creates a personalized learning schedule that maximizes retention while minimizing study time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="landing-features-section">
                <div className="landing-section-container">
                    <h2 className="landing-section-title">Everything You Need to Learn Effectively</h2>
                    
                    <div className="landing-features-grid">
                        <div className="feature-card">
                            <div className="landing-feature-icon">🤖</div>
                            <h3>AI-Generated Flashcards</h3>
                            <p>Upload PDFs or text files and let AI automatically create comprehensive flashcards from your study materials</p>
                            <div className="landing-feature-details">
                                <span>• Extract key concepts automatically</span>
                                <span>• Edit and customize before saving</span>
                                <span>• Supports PDFs and text files</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="landing-feature-icon">⌨️</div>
                            <h3>Smart Review Modes</h3>
                            <p>Choose between traditional flashcard review or typed responses with AI-powered scoring for deeper learning</p>
                            <div className="landing-feature-details">
                                <span>• Traditional card flipping</span>
                                <span>• Typed answer evaluation</span>
                                <span>• AI scoring for accuracy</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="landing-feature-icon">📊</div>
                            <h3>Intelligent Scheduling</h3>
                            <p>Advanced spaced repetition algorithm that adapts to your performance and learning patterns</p>
                            <div className="landing-feature-details">
                                <span>• Personalized review intervals</span>
                                <span>• Performance tracking</span>
                                <span>• Optimal study sessions</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="landing-feature-icon">📱</div>
                            <h3>Study Anywhere</h3>
                            <p>Clean, responsive design that works perfectly on desktop, tablet, and mobile devices</p>
                            <div className="landing-feature-details">
                                <span>• Cross-device synchronization</span>
                                <span>• Offline-ready design</span>
                                <span>• Fast, responsive interface</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="landing-how-it-works-section">
                <div className="landing-section-container">
                    <h2 className="landing-section-title">Get Started in 3 Simple Steps</h2>
                    
                    <div className="landing-steps-container">
                        <div className="step">
                            <div className="landing-step-number">1</div>
                            <div className="landing-step-content">
                                <h3>Create Your Cards</h3>
                                <p>Upload study materials and let AI generate flashcards, or create them manually</p>
                            </div>
                        </div>
                        
                        <div className="landing-step-arrow">→</div>
                        
                        <div className="step">
                            <div className="landing-step-number">2</div>
                            <div className="landing-step-content">
                                <h3>Start Studying</h3>
                                <p>Review your cards daily using our spaced repetition algorithm</p>
                            </div>
                        </div>
                        
                        <div className="landing-step-arrow">→</div>
                        
                        <div className="step">
                            <div className="landing-step-number">3</div>
                            <div className="landing-step-content">
                                <h3>Master the Material</h3>
                                <p>Watch your retention improve as the system optimizes your review schedule</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="landing-cta-section">
                <div className="landing-cta-container">
                    <h2>Ready to Transform Your Learning?</h2>
                    <p>Join thousands of students and professionals who trust Testudo for effective studying</p>
                    
                    <div className="landing-cta-buttons">
                        <button onClick={handleSignUpClick} className="landing-cta-primary large">
                            Start Learning Free
                        </button>
                    </div>
                    
                    <div className="landing-cta-benefits">
                        <span>✓ No credit card required</span>
                        <span>✓ Unlimited flashcards</span>
                        <span>✓ AI-powered features</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-section-container">
                    <p>&copy; 2025 Testudo. All rights reserved.</p>
                    <p>Empowering learners worldwide with intelligent spaced repetition.</p>
                    <div className="landing-footer-links">
                        <button onClick={handleSignUpClick}>Sign Up</button>
                        <button onClick={handleLoginClick}>Login</button>
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;