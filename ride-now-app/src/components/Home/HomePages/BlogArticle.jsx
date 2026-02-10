import React from "react";
import '../HomeScss/blogarticle.scss';
// import Sidebar from "./sidebar.js";

import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faComments, faClock, faArrowLeft, faHome, faEnvelope, faBlog, faTags } from '@fortawesome/free-solid-svg-icons';
import HomeTopbar from "./HomeTopbar";


function BlogArticle({ article, onBack }) {
    const navigate = useNavigate();

    if (!article) {
        return (
            <div className="article-not-found">
                <h2>Article not found</h2>
                <button onClick={() => navigate('/blog')}>Return to Blog</button>
            </div>
        );
    }

    return (
        <>
            <div className="article-container">
              
                <HomeTopbar/>
                {/* Page Navigation */}
                <div className="page-navigation">
                    <div className="nav-links">
                        <Link to="/" className="nav-link">
                            <FontAwesomeIcon icon={faHome} /> Home
                        </Link>
                        <span className="nav-separator">/</span>
                        <Link to="/blog" className="nav-link">
                            <FontAwesomeIcon icon={faBlog} /> Blog
                        </Link>
                        <span className="nav-separator">/</span>
                        <span className="nav-link active">Article</span>
                    </div>
                </div>
                
                <div className="article-content">
                    <div className="article-header">
                        <button className="back-button" onClick={onBack}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Blog
                        </button>
                        <h1>{article.title}</h1>
                        <div className="article-meta">
                            <span><FontAwesomeIcon icon={faUser} /> {article.author}</span>
                            <span><FontAwesomeIcon icon={faCalendarAlt} /> {article.date}</span>
                            <span><FontAwesomeIcon icon={faClock} /> {article.readTime}</span>
                            <span><FontAwesomeIcon icon={faComments} /> {article.comments} comments</span>
                        </div>
                        <div className="article-category">{article.category}</div>
                        <div className="article-image">
                            <img src={article.image} alt={article.title} />
                        </div>
                    </div>
                    
                    <div className="article-body">
                        <div className="article-text">
                            {article.fullContent.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        
                        <div className="article-tags">
                            <h3><FontAwesomeIcon icon={faTags} /> Tags</h3>
                            <div className="tags-list">
                                {article.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="article-share">
                            <h3>Share this article</h3>
                            <div className="share-buttons">
                                <button className="share-btn facebook">Facebook</button>
                                <button className="share-btn twitter">Twitter</button>
                                <button className="share-btn linkedin">LinkedIn</button>
                                <button className="share-btn email">Email</button>
                            </div>
                        </div>
                        
                        <div className="article-comments">
                            <h3>Comments ({article.comments})</h3>
                            <div className="comment-form">
                                <h4>Leave a comment</h4>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="form-group">
                                        <input type="text" placeholder="Your Name" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" placeholder="Your Email" required />
                                    </div>
                                    <div className="form-group">
                                        <textarea placeholder="Your Comment" rows="5" required></textarea>
                                    </div>
                                    <button type="submit" className="submit-btn">Post Comment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="related-articles">
                        <h3>Related Articles</h3>
                        <div className="related-articles-grid">
                            {article.relatedArticles && article.relatedArticles.map((related, index) => (
                                <div className="related-article-card" key={index}>
                                    <div className="related-article-image">
                                        <img src={related.image} alt={related.title} />
                                    </div>
                                    <div className="related-article-content">
                                        <h4>{related.title}</h4>
                                        <p><FontAwesomeIcon icon={faCalendarAlt} /> {related.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </>
    );
}

export default BlogArticle;
