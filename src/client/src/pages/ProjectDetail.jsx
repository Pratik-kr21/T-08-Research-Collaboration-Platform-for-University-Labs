import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import {
  ArrowLeft,
  Users,
  Calendar,
  FlaskConical,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import './ProjectDetail.css';

const statusColors = {
  Open: 'badge-success',
  Ongoing: 'badge-warning',
  Closed: 'badge-danger',
  Completed: 'badge-primary',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSendRequest = async () => {
    setSendingRequest(true);
    try {
      await API.post('/collaboration-requests', {
        projectId: id,
        message: requestMessage,
      });
      setRequestSent(true);
      setShowRequestForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FlaskConical size={28} className="spin" />
        <span>Loading project…</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state" style={{ margin: '80px auto' }}>
        <AlertCircle size={36} />
        <h3>Project not found</h3>
        <Link to="/projects" className="btn btn-outline">Back to Projects</Link>
      </div>
    );
  }

  const isOwner = project.owner?._id === user?._id;
  const isCollaborator = project.collaborators?.some((c) => c._id === user?._id);
  const canRequest = !isOwner && !isCollaborator && project.status === 'Open' && !requestSent;

  return (
    <div className="project-detail animate-fadeIn" id="project-detail-page">
      <div className="container">
        <Link to="/projects" className="back-link">
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        <div className="pd-layout">
          {/* Main Content */}
          <div className="pd-main">
            <div className="pd-header">
              <span className={`badge ${statusColors[project.status] || 'badge-neutral'}`}>
                {project.status}
              </span>
              {project.domain && (
                <span className="badge badge-neutral">{project.domain}</span>
              )}
            </div>

            <h1 className="pd-title">{project.title}</h1>

            <div className="pd-meta">
              <div className="pd-meta-item">
                <Calendar size={15} />
                <span>Created {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="pd-meta-item">
                <Users size={15} />
                <span>{project.collaborators?.length || 0}{project.teamSizeNeeded ? ` / ${project.teamSizeNeeded} members` : ' members'}</span>
              </div>
            </div>

            <div className="pd-section">
              <h2>Abstract</h2>
              <p className="pd-abstract">{project.abstract}</p>
            </div>

            {project.requiredSkills?.length > 0 && (
              <div className="pd-section">
                <h2>Required Skills</h2>
                <div className="pd-skills">
                  {project.requiredSkills.map((skill, i) => (
                    <span key={i} className="badge badge-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {project.milestones?.length > 0 && (
              <div className="pd-section">
                <h2>Milestones</h2>
                <div className="milestones-list">
                  {project.milestones.map((ms, i) => (
                    <div key={i} className="milestone-item">
                      <div className="ms-header">
                        <span className="ms-title">{ms.title}</span>
                        {ms.approved ? (
                          <span className="badge badge-success"><CheckCircle size={12} /> Approved</span>
                        ) : (
                          <span className="badge badge-neutral"><Clock size={12} /> Pending</span>
                        )}
                      </div>
                      <div className="ms-bar-bg">
                        <div
                          className="ms-bar-fill"
                          style={{ width: `${ms.progress || 0}%` }}
                        />
                      </div>
                      <div className="ms-footer">
                        <span>{ms.progress || 0}% complete</span>
                        {ms.deadline && (
                          <span>Due: {new Date(ms.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="pd-sidebar">
            {/* Owner Card */}
            <div className="sidebar-card">
              <h3>Project Lead</h3>
              <div className="pd-owner">
                <div className="pd-owner-avatar">
                  {project.owner?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="pd-owner-name">{project.owner?.name}</div>
                  <div className="pd-owner-dept">{project.owner?.department || 'No department'}</div>
                </div>
              </div>
            </div>

            {/* Team */}
            {project.collaborators?.length > 0 && (
              <div className="sidebar-card">
                <h3>Team Members</h3>
                <div className="pd-team-list">
                  {project.collaborators.map((collab) => (
                    <div key={collab._id} className="pd-team-member">
                      <div className="pd-team-avatar">{collab.name?.charAt(0)}</div>
                      <div>
                        <span className="pd-team-name">{collab.name}</span>
                        <span className="pd-team-role">{collab.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request to Collaborate */}
            {canRequest && (
              <div className="sidebar-card">
                <h3>Interested?</h3>
                {!showRequestForm ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => setShowRequestForm(true)}
                    id="request-collab-btn"
                  >
                    <Send size={16} />
                    Request to Collaborate
                  </button>
                ) : (
                  <div className="request-form">
                    <textarea
                      className="form-textarea"
                      placeholder="Introduce yourself and explain your interest…"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      rows={4}
                    />
                    <div className="request-form-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowRequestForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleSendRequest}
                        disabled={sendingRequest}
                      >
                        {sendingRequest ? 'Sending…' : 'Send Request'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {requestSent && (
              <div className="sidebar-card" style={{ background: 'var(--success-bg)', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: 500 }}>Request sent!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
