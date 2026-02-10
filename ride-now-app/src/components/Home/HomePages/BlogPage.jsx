import React, { useState, useEffect } from "react";
import '../HomeScss/blogpage.scss';
import '../HomeScss/blogmodal.scss';
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faComments, faSearch, faTags, faClock, faHome, faEnvelope, faBlog, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Import images
import blog1 from '../../User/UserAssests/Taxi.jpg';
import blog2 from '../HomeAssets/Background.jpg';
import blog3 from '../../User/UserAssests/cabPremium.png';
import blog4 from '../HomeAssets/L1.jpg';
import blog5 from '../HomeAssets/L2.jpg';
import blog6 from '../HomeAssets/L3.jpg';
import HomeTopbar from "./HomeTopbar.jsx";
// import Sidebar from "./User/sidebar.jsx";

function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3); // Number of posts to display per page
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Sample blog post data
    const blogPosts = [
        {
            id: 1,
            title: "The Future of Urban Transportation: Electric Cabs",
            excerpt: "Discover how electric vehicles are transforming the cab industry and creating a more sustainable future for urban transportation.",
            content: "The transportation industry is undergoing a significant transformation with the rise of electric vehicles. As cities worldwide strive to reduce carbon emissions and combat climate change, electric cabs are emerging as a sustainable alternative to traditional gasoline-powered taxis. This shift not only benefits the environment but also offers economic advantages for drivers and fleet operators. With lower maintenance costs, reduced fuel expenses, and various government incentives, electric cabs are becoming an increasingly attractive option. At RideNow, we're committed to leading this transition by expanding our electric vehicle fleet and installing charging stations across the city.",
            author: "Sarah Johnson",
            date: "August 10, 2025",
            category: "sustainability",
            tags: ["electric vehicles", "sustainability", "urban transport"],
            image: blog1,
            readTime: "5 min read",
            comments: 12
        },
        {
            id: 2,
            title: "Safety Tips for Late Night Rides",
            excerpt: "Essential safety practices every passenger should follow when using ride-sharing services after dark.",
            content: "While ride-sharing services have made transportation more convenient than ever, safety remains a top priority, especially for late-night journeys. This comprehensive guide offers practical advice for passengers to ensure a secure experience when traveling after dark. From verifying driver information and sharing your trip details with trusted contacts to choosing well-lit pickup locations and maintaining awareness throughout your journey, these simple yet effective strategies can significantly enhance your safety. At RideNow, we've implemented numerous safety features in our app, including real-time location sharing, emergency assistance buttons, and driver background checks, all designed to provide peace of mind for our passengers.",
            author: "Michael Chen",
            date: "August 5, 2025",
            category: "safety",
            tags: ["safety", "night rides", "passenger tips"],
            image: blog2,
            readTime: "4 min read",
            comments: 8
        },
        {
            id: 3,
            title: "How RideNow is Revolutionizing the Driver Experience",
            excerpt: "Learn about the innovative tools and support systems we've developed to empower our drivers and enhance their earning potential.",
            content: "At RideNow, we believe that happy drivers lead to happy passengers. That's why we've invested heavily in creating a driver experience that prioritizes flexibility, fair compensation, and comprehensive support. Our innovative driver app provides real-time earnings tracking, optimized route suggestions, and demand forecasting to help drivers maximize their income. We've also established driver support centers in major cities, offering in-person assistance, vehicle maintenance partnerships, and professional development opportunities. Additionally, our driver community programs facilitate knowledge sharing and create a sense of belonging among our diverse team of professionals. By taking care of our drivers, we ensure they can deliver the exceptional service our passengers have come to expect.",
            author: "Priya Patel",
            date: "July 28, 2025",
            category: "drivers",
            tags: ["drivers", "gig economy", "driver support"],
            image: blog3,
            readTime: "6 min read",
            comments: 15
        },
        {
            id: 4,
            title: "The Psychology of Ride-Sharing: Why We Prefer Cabs Over Driving",
            excerpt: "An exploration of the psychological factors that influence transportation choices in the modern urban landscape.",
            content: "The rise of ride-sharing services has fundamentally changed how people think about transportation, particularly in urban environments. This article delves into the psychological factors that drive consumers to choose ride-sharing over personal vehicle ownership or public transportation. From the relief of not having to find parking and the freedom from maintenance responsibilities to the social aspects of shared rides and the luxury of reclaiming commute time for productivity or relaxation, the appeal extends far beyond mere convenience. Understanding these psychological motivations helps explain why ride-sharing has experienced such explosive growth and offers insights into how services like RideNow can continue to evolve to meet deeper human needs beyond simple transportation.",
            author: "Dr. James Wilson",
            date: "July 20, 2025",
            category: "insights",
            tags: ["psychology", "consumer behavior", "urban lifestyle"],
            image: blog4,
            readTime: "7 min read",
            comments: 23
        },
        {
            id: 5,
            title: "Navigating Rush Hour: Best Times to Book Your Ride",
            excerpt: "Strategic advice for booking rides during peak hours to minimize wait times and avoid surge pricing.",
            content: "Rush hour can be a challenging time for both passengers and drivers in any transportation system. This practical guide offers data-driven strategies for navigating these peak periods efficiently when using ride-sharing services. By analyzing patterns from millions of rides, we've identified optimal booking windows that can significantly reduce wait times and help avoid surge pricing. The article also explores how different days of the week, weather conditions, and local events affect ride availability and pricing. With these insights and the advanced booking features available in the RideNow app, passengers can plan their essential journeys more effectively, saving both time and money even during the busiest hours.",
            author: "Alex Rivera",
            date: "July 15, 2025",
            category: "tips",
            tags: ["rush hour", "booking tips", "surge pricing"],
            image: blog5,
            readTime: "5 min read",
            comments: 19
        },
        {
            id: 6,
            title: "From Hailing to Apps: The Evolution of Cab Services",
            excerpt: "A historical perspective on how taxi services have transformed from street hailing to sophisticated mobile applications.",
            content: "The taxi industry has undergone a remarkable evolution over the past century, transforming from simple street-hailing services to sophisticated technology-driven platforms. This historical overview traces the key milestones in this journey, from the introduction of the first motorized taxis in the early 1900s to the dispatch radio systems of the mid-century and the revolutionary impact of GPS technology in the 1990s. The most dramatic shift, however, came with the smartphone revolution and the emergence of ride-hailing apps that fundamentally changed how passengers connect with drivers. By understanding this rich history, we gain perspective on the current state of the industry and can better anticipate future innovations that will continue to reshape urban mobility.",
            author: "Professor Emily Chang",
            date: "July 8, 2025",
            category: "history",
            tags: ["history", "technology evolution", "taxi industry"],
            image: blog6,
            readTime: "8 min read",
            comments: 7
        }
    ];
    
    // Categories derived from blog posts
    const categories = ['all', ...new Set(blogPosts.map(post => post.category))];
    
    // Filter posts based on category and search query
    useEffect(() => {
        let filtered = blogPosts;
        
        // Filter by category
        if (activeCategory !== 'all') {
            filtered = filtered.filter(post => post.category === activeCategory);
        }
        
        // Filter by search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.excerpt.toLowerCase().includes(query) || 
                post.content.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        setFilteredPosts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [activeCategory, searchQuery]);
    
    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    
    // Handle category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };
    
    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of blog posts section
        document.querySelector('.blog-posts').scrollIntoView({ behavior: 'smooth' });
    };
    
    // Handle opening article modal
    const openArticle = (post) => {
        setSelectedPost(post);
        setShowModal(true);
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };
    
    // Handle closing article modal
    const closeArticle = () => {
        setShowModal(false);
        setSelectedPost(null);
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    };
    
    // Get current posts for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
        <>
            <div className="blog-container">
               <HomeTopbar/>
                <div className="blog-hero">
                    <div className="blog-hero-overlay">
                        <h1>RideNow Blog</h1>
                        <p>Insights, tips, and stories from the world of transportation</p>
                        
                        <div className="search-container">
                            <div className="search-box">
                                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Search articles..." 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="blog-content">
                    <div className="category-filter">
                        <div className="category-list">
                            {categories.map(category => (
                                <button 
                                    key={category} 
                                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="blog-posts">
                        {filteredPosts.length > 0 ? (
                            currentPosts.map(post => (
                                <div className="blog-card" key={post.id}>
                                    <div className="blog-card-image">
                                        <img src={post.image} alt={post.title} />
                                        <div className="category-tag">{post.category}</div>
                                    </div>
                                    <div className="blog-card-content">
                                        <h2>{post.title}</h2>
                                        <div className="blog-meta">
                                            <span><FontAwesomeIcon icon={faUser} /> {post.author}</span>
                                            <span><FontAwesomeIcon icon={faCalendarAlt} /> {post.date}</span>
                                            <span><FontAwesomeIcon icon={faClock} /> {post.readTime}</span>
                                            <span><FontAwesomeIcon icon={faComments} /> {post.comments} comments</span>
                                        </div>
                                        <p className="blog-excerpt">{post.excerpt}</p>
                                        <div className="blog-tags">
                                            <FontAwesomeIcon icon={faTags} />
                                            {post.tags.map((tag, index) => (
                                                <span key={index} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                        <button className="read-more-btn" onClick={() => openArticle(post)}>Read More</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <h3>No articles found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="blog-sidebar">
                        <div className="sidebar-section popular-posts">
                            <h3>Popular Posts</h3>
                            <div className="popular-post-list">
                                {blogPosts.slice(0, 3).map(post => (
                                    <div className="popular-post-item" key={post.id}>
                                        <div className="popular-post-image">
                                            <img src={post.image} alt={post.title} />
                                        </div>
                                        <div className="popular-post-content">
                                            <h4>{post.title}</h4>
                                            <p><FontAwesomeIcon icon={faCalendarAlt} /> {post.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="sidebar-section categories">
                            <h3>Categories</h3>
                            <ul>
                                {categories.filter(cat => cat !== 'all').map(category => (
                                    <li key={category} onClick={() => handleCategoryChange(category)}>
                                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                                        <span className="category-count">
                                            {blogPosts.filter(post => post.category === category).length}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="sidebar-section tags">
                            <h3>Popular Tags</h3>
                            <div className="tag-cloud">
                                {Array.from(new Set(blogPosts.flatMap(post => post.tags))).map(tag => (
                                    <span 
                                        key={tag} 
                                        className="tag-item"
                                        onClick={() => setSearchQuery(tag)}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="sidebar-section newsletter">
                            <h3>Subscribe to Our Newsletter</h3>
                            <p>Get the latest articles and insights delivered straight to your inbox.</p>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Your email address" required />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>
                
                {filteredPosts.length > 0 && (
                    <div className="blog-pagination">
                        {currentPage > 1 && (
                            <button 
                                className="pagination-btn prev" 
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} /> Prev
                            </button>
                        )}
                        
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Show limited page numbers with ellipsis for better UX
                            if (
                                pageNumber === 1 || 
                                pageNumber === totalPages || 
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button 
                                        key={pageNumber} 
                                        className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 || 
                                pageNumber === currentPage + 2
                            ) {
                                return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                            }
                            return null;
                        })}
                        
                        {currentPage < totalPages && (
                            <button 
                                className="pagination-btn next" 
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        )}
                    </div>
                )}
                
                <Footer />
            </div>
            
            {/* Article Modal */}
            {showModal && selectedPost && (
                <div className="article-modal-overlay" onClick={closeArticle}>
                    <div className="article-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeArticle}>
                            &times;
                        </button>
                        <div className="article-modal-content">
                            <div className="article-header">
                                <div className="article-image">
                                    <img src={selectedPost.image} alt={selectedPost.title} />
                                    <div className="category-tag">{selectedPost.category}</div>
                                </div>
                                <h1>{selectedPost.title}</h1>
                                <div className="article-meta">
                                    <span><FontAwesomeIcon icon={faUser} /> {selectedPost.author}</span>
                                    <span><FontAwesomeIcon icon={faCalendarAlt} /> {selectedPost.date}</span>
                                    <span><FontAwesomeIcon icon={faClock} /> {selectedPost.readTime}</span>
                                    <span><FontAwesomeIcon icon={faComments} /> {selectedPost.comments} comments</span>
                                </div>
                            </div>
                            
                            <div className="article-body">
                                <p className="article-excerpt">{selectedPost.excerpt}</p>
                                <p className="article-content">{selectedPost.content}</p>
                            </div>
                            
                            <div className="article-tags">
                                <FontAwesomeIcon icon={faTags} />
                                {selectedPost.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BlogPage;
