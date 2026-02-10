import React, { useState, useEffect, useRef } from "react";
import '../HomeScss/contactpage.scss';
import Footer from "./Footer.jsx";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import HomeTopbar from "./HomeTopbar.jsx";

const officeLocation = [37.3688, -122.0363]; // Silicon Valley coordinates

function ContactPage() {
    const mapRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setFormError(true);
            setTimeout(() => setFormError(false), 3000);
            return;
        }
        
        // In a real application, you would send this data to your backend
        console.log('Form submitted:', formData);
        
        // Reset form and show success message
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 5000);
    };
    
    // Initialize map when component mounts
    useEffect(() => {
        if (!mapRef.current) {
            // Initialize the map
            const map = L.map('contact-map').setView(officeLocation, 13);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Add a marker for the office location
            const marker = L.marker(officeLocation).addTo(map);
            marker.bindPopup('<b>RideNow Headquarters</b><br>123 RideNow Street, Tech Park<br>Silicon Valley, CA 94024').openPopup();
            
            // Add click event to show user's location
            map.on('click', function(e) {
                const clickedLocation = [e.latlng.lat, e.latlng.lng];
                L.marker(clickedLocation).addTo(map)
                    .bindPopup('You clicked here: ' + e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4)).openPopup();
                
                // Calculate and display route (simplified version)
                const routePoints = [
                    L.latLng(officeLocation[0], officeLocation[1]),
                    L.latLng(clickedLocation[0], clickedLocation[1])
                ];
                
                // Draw a simple line between the points
                L.polyline(routePoints, {color: '#3498db', weight: 5}).addTo(map);
                
                // Calculate straight-line distance
                const distance = map.distance(routePoints[0], routePoints[1]) / 1000; // in km
                L.popup()
                    .setLatLng([(officeLocation[0] + clickedLocation[0])/2, (officeLocation[1] + clickedLocation[1])/2])
                    .setContent(`Approximate distance: ${distance.toFixed(2)} km`)
                    .openOn(map);
            });
            
            // Store map reference
            mapRef.current = map;
        }
        
        // Cleanup function to destroy map when component unmounts
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <>
            <div className="contact-container">
             <HomeTopbar/>
                
                <div className="contact-hero">
                    <div className="contact-hero-overlay">
                        <h1>Contact Us</h1>
                        <p>We'd love to hear from you. Reach out to us with any questions or feedback.</p>
                    </div>
                </div>
                
                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Have questions about our services or need assistance? Our team is here to help you.</p>
                        
                        <div className="contact-details">
                            <div className="contact-item">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                                <div>
                                    <h3>Our Location</h3>
                                    <p>123 RideNow Street, Tech Park</p>
                                    <p>Silicon Valley, CA 94024</p>
                                </div>
                            </div>
                            
                            <div className="contact-item">
                                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                                <div>
                                    <h3>Phone Number</h3>
                                    <p>Customer Support: +1 (555) 123-4567</p>
                                    <p>Driver Support: +1 (555) 765-4321</p>
                                </div>
                            </div>
                            
                            <div className="contact-item">
                                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                                <div>
                                    <h3>Email Address</h3>
                                    <p>support@ridenow.com</p>
                                    <p>careers@ridenow.com</p>
                                </div>
                            </div>
                            
                            <div className="contact-item">
                                <FontAwesomeIcon icon={faClock} className="contact-icon" />
                                <div>
                                    <h3>Working Hours</h3>
                                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                                    <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="contact-form-container">
                        <h2>Send Us a Message</h2>
                        
                        {formSubmitted && (
                            <div className="form-success">
                                Thank you for your message! We'll get back to you soon.
                            </div>
                        )}
                        
                        {formError && (
                            <div className="form-error">
                                Please fill in all required fields.
                            </div>
                        )}
                        
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What is this regarding?"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="message">Message <span className="required">*</span></label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Type your message here..."
                                    rows="5"
                                    required
                                ></textarea>
                            </div>
                            
                            <button type="submit" className="submit-button">Send Message</button>
                        </form>
                    </div>
                </div>
                
                <div className="map-container">
                    <h2>Find Us</h2>
                    <div id="contact-map" className="map"></div>
                </div>
                
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-container">
                        <div className="faq-item">
                            <h3>How do I book a ride?</h3>
                            <p>You can book a ride through our mobile app or website by entering your pickup location and destination, then selecting your preferred vehicle type.</p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>How do I become a driver?</h3>
                            <p>To become a driver, you need to sign up on our website, submit required documents, pass a background check, and complete our onboarding process.</p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>What payment methods do you accept?</h3>
                            <p>We accept credit/debit cards, digital wallets like Apple Pay and Google Pay, and cash payments in select locations.</p>
                        </div>
                        
                        <div className="faq-item">
                            <h3>How do I report an issue with my ride?</h3>
                            <p>You can report issues through the app's "Help" section, by emailing support@ridenow.com, or by calling our customer support line.</p>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}

export default ContactPage;
