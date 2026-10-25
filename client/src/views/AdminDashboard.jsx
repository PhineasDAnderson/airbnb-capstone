import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api';

// Cloudinary details used to upload pictures straight from the browser (unsigned preset)
const CLOUD_NAME = 'r3t5x7j7';
const UPLOAD_PRESET = 'airbnb_unsigned';

const locationOptions = ['Paris, France', 'Mauritius', 'Cape Town, South Africa', 'Bali, Indonesia', 'Montreal, Canada', 'Tokyo, Japan'];
const typeOptions = ['Entire home', 'Luxury Villa', 'Entire apartment', 'Private villa', 'Private room'];

// Styles that get used many times
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };
const uploadButtonStyle = { display: 'inline-block', padding: '10px 16px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' };

// Round buttons at the top (the active one gets a dark border)
const pillStyle = (isActive) => ({
  padding: '8px 16px',
  borderRadius: '20px',
  border: isActive ? '2px solid #222222' : '1px solid #dddddd',
  backgroundColor: isActive ? '#f7f7f7' : '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
});

// An empty form (used to start a new listing or reset the form)
const emptyForm = {
  title: '',
  type: '',
  price: '',
  location: '',
  description: '',
  guests: '',
  bedrooms: '',
  bathrooms: '',
  enhancedCleaning: false,
  selfCheckIn: false
};

// Checks one picked file. Gives back an error message, or an empty text if it is fine.
const checkFile = (file) => {
  if (!file.type.startsWith('image/')) {
    return 'Please choose image files only.';
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'Each image must be smaller than 5MB.';
  }
  return '';
};

// Sends one file to Cloudinary and gives back the link of the uploaded image
const uploadImage = async (file) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    data
  );

  // Adds a size limit to the link so the pages load faster
  return response.data.secure_url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');
};

function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('view-listings');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Everything typed into the form
  const [formData, setFormData] = useState(emptyForm);

  // Amenities and images are lists, so they have their own state
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [images, setImages] = useState([]);

  // The "Where you'll sleep" photo and its caption
  const [sleepingUrl, setSleepingUrl] = useState('');
  const [sleepingCaption, setSleepingCaption] = useState('');

  // True while a photo is being sent to Cloudinary
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Red message shown above the form
  const [formError, setFormError] = useState('');

  // The id of the listing being edited. Empty means we are creating a new one.
  const [editingId, setEditingId] = useState(null);

  // The logged in user's id is saved as the host of the listing
  const userId = user?._id || user?.id;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await API.get('/accommodations');
      setListings(response.data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Runs when the user types in a box, ticks a box or picks from a dropdown
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Tick boxes use "checked", everything else uses "value"
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const addAmenity = () => {
    if (amenityInput.trim() === '') return;
    setAmenities([...amenities, amenityInput.trim()]);
    setAmenityInput('');
  };

  const removeAmenity = (position) => {
    setAmenities(amenities.filter((item, index) => index !== position));
  };

  // Runs when the user picks photos for the gallery
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    // Clear the file box so the same photo can be picked again later
    e.target.value = '';
    if (files.length === 0) return;

    setUploadError('');

    // Stop if any of the files is not allowed
    for (const file of files) {
      const problem = checkFile(file);
      if (problem) {
        setUploadError(problem);
        return;
      }
    }

    setUploading(true);
    try {
      // Upload the photos one by one and collect their links
      const newLinks = [];
      for (const file of files) {
        const link = await uploadImage(file);
        newLinks.push(link);
      }
      setImages([...images, ...newLinks]);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (position) => {
    setImages(images.filter((item, index) => index !== position));
  };

  // Runs when the user picks the bedroom photo (only one photo)
  const handleSleepingUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');

    const problem = checkFile(file);
    if (problem) {
      setUploadError(problem);
      return;
    }

    setUploading(true);
    try {
      const link = await uploadImage(file);
      setSleepingUrl(link);
    } catch (error) {
      console.error('Bedroom photo upload failed:', error);
      setUploadError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Empties the form (used after saving and by the Cancel button)
  const clearForm = () => {
    setFormData(emptyForm);
    setAmenities([]);
    setImages([]);
    setSleepingUrl('');
    setSleepingCaption('');
    setAmenityInput('');
    setUploadError('');
    setFormError('');
    setEditingId(null);
  };

  // Update button: fills the form with the listing's data and opens the form
  const handleUpdateClick = (item) => {
    setFormData({
      title: item.title || '',
      type: item.type || '',
      price: item.pricePerNight !== undefined ? String(item.pricePerNight) : '',
      location: item.location || '',
      description: item.description || '',
      guests: item.maxGuests !== undefined ? String(item.maxGuests) : '',
      bedrooms: item.bedrooms !== undefined ? String(item.bedrooms) : '',
      bathrooms: item.bathrooms !== undefined ? String(item.bathrooms) : '',
      enhancedCleaning: item.enhancedCleaning || false,
      selfCheckIn: item.selfCheckIn || false
    });
    setAmenities(item.amenities || []);
    setImages(item.images || []);
    setSleepingUrl(item.sleepingImage?.url || '');
    setSleepingCaption(item.sleepingImage?.caption || '');
    setAmenityInput('');
    setUploadError('');
    setFormError('');
    setEditingId(item._id);
    setActiveTab('create-listing');
    window.scrollTo(0, 0);
  };

  // Top buttons: clear the form first so an old edit doesn't stay on screen
  const showListingsTab = () => {
    clearForm();
    setActiveTab('view-listings');
  };

  const showCreateTab = () => {
    clearForm();
    setActiveTab('create-listing');
  };

  // Runs for both Create and Update (editingId tells us which one it is)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Check the form before sending anything to the backend
    if (uploading) {
      setFormError('Please wait for the photos to finish uploading.');
      return;
    }
    if (!formData.title || !formData.type || !formData.location || !formData.description) {
      setFormError('Please fill in the title, type, location and description.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Please enter a price greater than 0.');
      return;
    }
    if (!formData.guests || !formData.bedrooms || !formData.bathrooms) {
      setFormError('Please enter the number of guests, bedrooms and bathrooms.');
      return;
    }
    if (images.length === 0) {
      setFormError('Please upload at least one image.');
      return;
    }
    if (!editingId && !userId) {
      setFormError('Your login could not be found. Please log in again.');
      return;
    }

    // Use the same names as our database schema
    const listingData = {
      title: formData.title,
      type: formData.type,
      location: formData.location,
      description: formData.description,
      pricePerNight: Number(formData.price),
      maxGuests: Number(formData.guests),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      enhancedCleaning: formData.enhancedCleaning,
      selfCheckIn: formData.selfCheckIn,
      amenities: amenities,
      images: images,
      sleepingImage: { url: sleepingUrl, caption: sleepingCaption }
    };

    try {
      if (editingId) {
        // UPDATE: send the changes and swap the old listing for the new one on screen
        const response = await API.put(`/accommodations/${editingId}`, listingData);
        setListings(listings.map((item) => (item._id === editingId ? response.data : item)));
        clearForm();
        alert('Listing updated successfully!');
      } else {
        // CREATE: a new listing also needs the host (the logged in user)
        const response = await API.post('/accommodations', { ...listingData, host: userId });
        setListings([...listings, response.data]);
        clearForm();
        alert('Listing created successfully!');
      }
      setActiveTab('view-listings');
    } catch (error) {
      console.error('Error saving listing:', error);
      // Show the backend's message if there is one
      setFormError(
        error.response?.data?.message ||
        (editingId ? 'Failed to update listing.' : 'Failed to create listing.')
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await API.delete(`/accommodations/${id}`);
        setListings(listings.filter((item) => item._id !== id));
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing.');
      }
    }
  };

  // Only show the logged in user's listings.
  // If we don't know the user id, show all of them so the page isn't empty.
  const myListings = userId
    ? listings.filter((item) => item.host === userId)
    : listings;

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#222222' }}>

      {/* Round buttons at the top */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => navigate('/view-reservations')} style={pillStyle(false)}>
          View Reservations
        </button>
        <button type="button" onClick={showListingsTab} style={pillStyle(activeTab === 'view-listings')}>
          View Listings
        </button>
        <button type="button" onClick={showCreateTab} style={pillStyle(activeTab === 'create-listing' && !editingId)}>
          Create Listing
        </button>
      </div>

      {/* VIEW LISTINGS */}
      {activeTab === 'view-listings' && (
        <div>
          <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>
            My Listings
          </h1>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#717171' }}>Loading listings...</p>
          ) : myListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#717171' }}>
              <p style={{ marginBottom: '16px' }}>No listings found for this account.</p>
              <button
                type="button"
                onClick={showCreateTab}
                style={{ padding: '10px 20px', backgroundColor: '#ff385c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Add Your First Listing
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myListings.map((item) => (
                <div
                  key={item._id}
                  style={{ display: 'flex', gap: '24px', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '24px', backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap' }}
                >
                  {/* Left side: first image and the Update / Delete buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px', flexShrink: 0 }}>
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title}
                      style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(item)}
                      style={{ width: '100%', padding: '8px 0', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      style={{ width: '100%', padding: '8px 0', backgroundColor: '#e11d48', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Right side: listing details */}
                  <div style={{ flex: 1, minWidth: '240px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 6px 0' }}>
                        {item.type} - {item.location}
                      </p>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{item.title}</h2>
                      <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 6px 0' }}>
                        {item.maxGuests} guests - {item.bedrooms} bedrooms - {item.bathrooms} bathrooms
                      </p>
                      <p style={{ fontSize: '13px', color: '#717171', margin: '0 0 16px 0' }}>
                        Amenities: {item.amenities && item.amenities.join(', ')}
                      </p>
                      <div style={{ fontSize: '13px' }}>
                        <span>★ </span>
                        <span style={{ fontWeight: 'bold' }}>{item.rating}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>${item.pricePerNight}/night</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / UPDATE LISTING (same form, the title and button change) */}
      {activeTab === 'create-listing' && (
        <div>
          <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>
            {editingId ? 'Update Listing' : 'Create Listing'}
          </h1>

          <form onSubmit={handleSubmit} style={{ maxWidth: '850px', margin: '0 auto' }}>

            {formError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #fecaca' }}>
                ⚠️ {formError}
              </div>
            )}

            {/* Two columns side by side */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

              {/* Left column: title, location, description, tick boxes, amenities */}
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Listing Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Charming Home in Paris" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Location</label>
                  <select name="location" value={formData.location} onChange={handleChange} style={inputStyle}>
                    <option value="">Select a location</option>
                    {locationOptions.map((place) => (
                      <option key={place} value={place}>{place}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows="6" placeholder="Describe the property..." style={inputStyle} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                  <label>
                    <input type="checkbox" name="enhancedCleaning" checked={formData.enhancedCleaning} onChange={handleChange} /> Enhanced Cleaning
                  </label>
                  <label>
                    <input type="checkbox" name="selfCheckIn" checked={formData.selfCheckIn} onChange={handleChange} /> Self Check-in
                  </label>
                </div>

                {/* Amenities: text box, Add button and the list so far */}
                <div>
                  <label style={labelStyle}>Amenities</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="e.g. wifi" style={inputStyle} />
                    <button type="button" onClick={addAmenity} style={{ padding: '0 20px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Add
                    </button>
                  </div>
                  {amenities.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f3f4f6', padding: '8px 10px', borderRadius: '6px', marginTop: '8px', fontSize: '14px' }}>
                      <span>{item}</span>
                      <button type="button" onClick={() => removeAmenity(index)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e11d48', fontWeight: 'bold' }}>
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: price, type, numbers, images, buttons */}
              <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="400" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                      <option value="">Select an option</option>
                      {typeOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Guests</label>
                    <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Bedrooms</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="1" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Bathrooms</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="1" style={inputStyle} />
                  </div>
                </div>

                {/* Gallery images: choose files, they upload to Cloudinary and a preview shows below */}
                <div>
                  <label style={labelStyle}>Images (the first one is the main photo)</label>
                  <label style={{ ...uploadButtonStyle, opacity: uploading ? 0.6 : 1 }}>
                    {uploading ? 'Uploading...' : 'Choose images'}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
                  </label>

                  <div style={{ border: '1px solid #ccc', borderRadius: '8px', minHeight: '90px', marginTop: '10px', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: images.length === 0 ? 'center' : 'flex-start' }}>
                    {images.length === 0 ? (
                      <span style={{ color: '#717171', fontSize: '14px' }}>No images uploaded</span>
                    ) : (
                      images.map((link, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img src={link} alt={`Preview ${index + 1}`} style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                          <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '2px', right: '2px', border: 'none', borderRadius: '50%', cursor: 'pointer', backgroundColor: '#e11d48', color: '#fff', width: '20px', height: '20px', fontSize: '11px' }}>
                            X
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bedroom photo and caption for the "Where you'll sleep" section */}
                <div>
                  <label style={labelStyle}>Where you'll sleep (bedroom photo)</label>
                  <label style={{ ...uploadButtonStyle, opacity: uploading ? 0.6 : 1 }}>
                    {sleepingUrl ? 'Change bedroom photo' : 'Choose bedroom photo'}
                    <input type="file" accept="image/*" onChange={handleSleepingUpload} disabled={uploading} style={{ display: 'none' }} />
                  </label>

                  {sleepingUrl && (
                    <div style={{ position: 'relative', width: '140px', marginTop: '10px' }}>
                      <img src={sleepingUrl} alt="Bedroom preview" style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                      <button type="button" onClick={() => setSleepingUrl('')} style={{ position: 'absolute', top: '2px', right: '2px', border: 'none', borderRadius: '50%', cursor: 'pointer', backgroundColor: '#e11d48', color: '#fff', width: '20px', height: '20px', fontSize: '11px' }}>
                        X
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={sleepingCaption}
                    onChange={(e) => setSleepingCaption(e.target.value)}
                    placeholder="Caption, e.g. Bedroom 1 - king bed"
                    style={{ ...inputStyle, marginTop: '10px' }}
                  />
                </div>

                {/* Shows a red message if a photo could not be uploaded */}
                {uploadError && (
                  <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', fontSize: '13px', border: '1px solid #fecaca' }}>
                    ⚠️ {uploadError}
                  </div>
                )}

                {/* Save and Cancel buttons */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                  <button type="submit" disabled={uploading} style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={showListingsTab}
                    style={{ flex: 1, padding: '12px', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
