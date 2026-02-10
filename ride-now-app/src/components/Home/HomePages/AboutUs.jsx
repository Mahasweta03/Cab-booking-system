import React from "react";

import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
// import Sidebar from "./User/sidebar.js";
import teamMember1 from '../HomeAssets/team-member-1.jpg';
import teamMember2 from '../HomeAssets/team-member-2.jpg';
import teamMember3 from '../HomeAssets/team-member-3.jpg';
import teamMember4 from '../HomeAssets/team-member-4.jpg';
import teamMember5 from '../HomeAssets/team-member-5 .jpg';
import partnerLogo1 from '../HomeAssets/partnerLogo1.jpg';
import partnerLogo2 from '../HomeAssets/partnerLogo2.jpg';
import partnerLogo3 from '../HomeAssets/partnerLogo3.jpg';
import partnerLogo4 from '../HomeAssets/partnerLogo4.png';
import partnerLogo5 from '../HomeAssets/partnerLogo5.jpg';
import partnerLogo6 from '../HomeAssets/partnerLogo6.png';
import HomeTopbar from "./HomeTopbar.jsx";

// Using online placeholder images instead of local imports
// const teamMember1 = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
//  const teamMember2 = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
// const teamMember3 = "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
// const teamMember4 = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

// About page images
const aboutHero = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";
const historyImage = "https://images.unsplash.com/photo-1600320254374-ce2d293c324e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const missionImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

// Partner logos (using placeholder logos)
// const partnerLogo1 = "https://placehold.co/200x100/e3e3e3/626262?text=Partner+1";
// const partnerLogo2 = "https://placehold.co/200x100/e3e3e3/626262?text=Partner+2";
// const partnerLogo3 = "https://placehold.co/200x100/e3e3e3/626262?text=Partner+3";
// const partnerLogo4 = "https://placehold.co/200x100/e3e3e3/626262?text=Partner+4";
// const partnerLogo5 = "https://placehold.co/200x100/e3e3e3/626262?text=Partner+5";
// const partnerLogo6 = "https://placehold.co/200x100/e3e3e3/626262?text=Partner+6";

function AboutUs() {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Mahasweta Saha",
      position: "Programmer Analyst Trainee",
      image: teamMember1,
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    },
    {
      id: 2,
      name: "Shrutiga K",
      position: "Programmer Analyst Trainee",
      image: teamMember2,
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    },
    {
      id: 3,
      name: "Venkat, Challamcharla Dhanush",
      position: "Programmer Analyst Trainee",
      image: teamMember3,
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    },
    {
      id: 4,
      name: "Ameesha G",
      position: "Programmer Analyst Trainee",
      image: teamMember4,
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    },
    {
      id: 5,
      name: "Reddy, Pindikuri Likhitha",
      position: "Programmer Analyst Trainee",
      image: teamMember5,
      social: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        facebook: "https://facebook.com"
      }
    }
  ];

  // Company values data
  const companyValues = [
    {
      id: 1,
      title: "Safety First",
      description: "We prioritize the safety of our passengers and drivers above all else, with rigorous screening processes and continuous monitoring.",
      icon: "bi bi-shield-check"
    },
    {
      id: 2,
      title: "Reliability",
      description: "Count on us for timely pickups and efficient routes, getting you to your destination when you need to be there.",
      icon: "bi bi-clock-history"
    },
    {
      id: 3,
      title: "Sustainability",
      description: "We're committed to reducing our environmental impact through electric vehicles and carbon offset programs.",
      icon: "bi bi-tree"
    },
    {
      id: 4,
      title: "Innovation",
      description: "We continuously evolve our technology to improve the ride experience and stay ahead of industry trends.",
      icon: "bi bi-lightbulb"
    },
    {
      id: 5,
      title: "Community",
      description: "We believe in giving back to the communities we serve through various outreach and support programs.",
      icon: "bi bi-people"
    },
    {
      id: 6,
      title: "Transparency",
      description: "We maintain open communication with our customers and partners, with clear pricing and policies.",
      icon: "bi bi-hand-thumbs-up"
    }
  ];

  // Partner logos
  const partners = [
    { id: 1, name: "Partner 1", logo: partnerLogo1 },
    { id: 2, name: "Partner 2", logo: partnerLogo2 },
    { id: 3, name: "Partner 3", logo: partnerLogo3 },
    { id: 4, name: "Partner 4", logo: partnerLogo4 },
    { id: 5, name: "Partner 5", logo: partnerLogo5 },
    { id: 6, name: "Partner 6", logo: partnerLogo6 }
  ];

  // Milestones data
  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description: "RideNow was established with a small fleet of 10 vehicles in one city."
    },
    {
      year: "2019",
      title: "Mobile App Launch",
      description: "We launched our first mobile application, making ride booking more convenient."
    },
    {
      year: "2020",
      title: "Expansion to 5 Cities",
      description: "Expanded operations to five major metropolitan areas with a fleet of 100+ vehicles."
    },
    {
      year: "2021",
      title: "Electric Vehicle Initiative",
      description: "Introduced our first electric vehicles, committing to a greener future."
    },
    {
      year: "2023",
      title: "Premium Service Launch",
      description: "Launched our premium service tier with luxury vehicles and enhanced amenities."
    },
    {
      year: "2025",
      title: "National Coverage",
      description: "Achieved nationwide coverage with operations in over 50 cities and a fleet of 1000+ vehicles."
    }
  ];
  
  return (
    <div className="about-container2" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333" }}>
     
      <HomeTopbar/>
      {/* Hero Section */}
      <div style={{ 
        position: "relative",
        height: "500px",
        backgroundImage: `url(${aboutHero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        marginTop: "73px"
      }}>
        <div style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, rgba(44, 62, 80, 0.9), rgba(44, 62, 80, 0.7))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ 
            textAlign: "center",
            color: "white",
            maxWidth: "800px",
            padding: "0 20px"
          }}>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "20px", fontWeight: 600 }}>About RideNow</h1>
            <p style={{ fontSize: "1.3rem", lineHeight: 1.6, color: "wheat" }}>Transforming urban mobility with innovative transportation solutions</p>
          </div>
        </div>
      </div>
      
      {/* Introduction Section */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "15px" }}>Who We Are</h2>
            <div style={{ height: "4px", width: "70px", background: "#3498db", margin: "0 auto 20px" }}></div>
            <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              RideNow is a leading transportation service provider dedicated to offering convenient, 
              reliable, and safe rides for all your travel needs.
            </p>
          </div>
          
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "25px", color: "#555" }}>
              At RideNow, we believe that transportation should be more than just getting from point A to point B. 
              It should be a seamless, enjoyable experience that enhances your day rather than complicating it. 
              Founded in 2018, we've grown from a small local operation to a nationwide service, but our commitment 
              to exceptional customer service has remained unchanged.
            </p>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "25px", color: "#555" }}>
              Our team of dedicated professionals works tirelessly to ensure that every ride with RideNow meets our 
              high standards of quality, safety, and reliability. From our carefully screened drivers to our 
              customer support specialists, everyone at RideNow shares the same passion for excellence.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#f9f9f9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "15px" }}>Our Story</h2>
            <div style={{ height: "4px", width: "70px", background: "#3498db", margin: "0 auto 20px" }}></div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center" }}>
            <div>
              <img src={historyImage} alt="RideNow History" style={{ width: "100%", height: "auto", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.8rem", color: "#2c3e50", marginBottom: "20px" }}>From Humble Beginnings to Industry Leader</h3>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "20px", color: "#555" }}>
                RideNow began as a small startup with a big vision: to transform the way people move around cities. 
                Our founder, Sarah Johnson, experienced firsthand the frustrations of unreliable transportation and 
                was determined to create a better alternative.
              </p>
              <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "20px", color: "#555" }}>
                Starting with just 10 vehicles in one city, we focused on building a reputation for reliability and 
                exceptional service. Word spread quickly, and demand for our services grew. By reinvesting in our 
                technology and our people, we expanded to new markets while maintaining the quality that set us apart.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "15px" }}>Our Values</h2>
            <div style={{ height: "4px", width: "70px", background: "#3498db", margin: "0 auto 20px" }}></div>
            <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              These core principles guide everything we do at RideNow
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
            {companyValues.map(value => (
              <div key={value.id} style={{ 
                backgroundColor: "white", 
                borderRadius: "10px", 
                padding: "30px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "2.5rem", color: "#3498db", marginBottom: "15px" }}>
                  <i className={value.icon}></i>
                </div>
                <h3 style={{ fontSize: "1.5rem", color: "#2c3e50", marginBottom: "15px" }}>{value.title}</h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#666" }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#f9f9f9" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "15px" }}>Our Leadership Team</h2>
            <div style={{ height: "4px", width: "70px", background: "#3498db", margin: "0 auto 20px" }}></div>
            <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              Meet the dedicated professionals behind RideNow's success
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "30px" }}>
            {teamMembers.map(member => (
              <div key={member.id} style={{ 
                backgroundColor: "white", 
                borderRadius: "10px", 
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
              }}>
                <div style={{ position: "relative" }}>
                  <img src={member.image} alt={member.name} style={{ width: "100%", height: "250px", objectFit: "cover" }} />
                  <div style={{ 
                    position: "absolute", 
                    bottom: "0", 
                    left: "0", 
                    width: "100%", 
                    display: "flex", 
                    justifyContent: "center", 
                    gap: "10px", 
                    padding: "10px 0", 
                    background: "rgba(0, 0, 0, 0.5)" 
                  }}>
                    <a href={member.social.linkedin} aria-label="LinkedIn" style={{ color: "white", fontSize: "1.2rem" }}>
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href={member.social.twitter} aria-label="Twitter" style={{ color: "white", fontSize: "1.2rem" }}>
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href={member.social.facebook} aria-label="Facebook" style={{ color: "white", fontSize: "1.2rem" }}>
                      <i className="bi bi-facebook"></i>
                    </a>
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "1.3rem", color: "#2c3e50", marginBottom: "5px" }}>{member.name}</h3>
                  <h4 style={{ fontSize: "1rem", color: "#3498db", marginBottom: "15px", fontWeight: "normal" }}>{member.position}</h4>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#666" }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#2c3e50", marginBottom: "15px" }}>Our Partners</h2>
            <div style={{ height: "4px", width: "70px", background: "#3498db", margin: "0 auto 20px" }}></div>
            <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
              Trusted companies we collaborate with to enhance your experience
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
            {partners.map(partner => (
              <div key={partner.id} style={{ 
                backgroundColor: "white", 
                borderRadius: "10px", 
                padding: "30px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <img src={partner.logo} alt={partner.name} style={{ maxWidth: "100%", height: "auto" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section style={{ 
        padding: "80px 0", 
        backgroundColor: "#3498db", 
        color: "white", 
        textAlign: "center" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ fontSize: "2.2rem", marginBottom: "15px" }}>Ready to Experience RideNow?</h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "30px", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" }}>
            Join thousands of satisfied customers who rely on RideNow for their daily transportation needs.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <Link to="/contact" style={{ 
              display: "inline-block", 
              padding: "12px 30px", 
              borderRadius: "5px", 
              fontSize: "1rem", 
              fontWeight: "500", 
              textDecoration: "none", 
              backgroundColor: "white", 
              color: "#3498db", 
              transition: "all 0.3s ease" 
            }}>
              Contact Us
            </Link>
            <Link to="/ridebooking" style={{ 
              display: "inline-block", 
              padding: "12px 30px", 
              borderRadius: "5px", 
              fontSize: "1rem", 
              fontWeight: "500", 
              textDecoration: "none", 
              backgroundColor: "transparent", 
              color: "white", 
              border: "2px solid white", 
              transition: "all 0.3s ease" 
            }}>
              Book a Ride
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );


        
        

}

export default AboutUs;
