import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5001/api';

// --- Data Constants ---
const EXERCISE_CATEGORIES = ['Strength', 'Cardio', 'Flexibility', 'HIIT', 'Yoga'];
const PRODUCT_CATEGORIES = ['Protein', 'Supplements', 'Creatine', 'BCAA', 'Vitamins', 'Fat Burner', 'Snacks', 'Oats'];
const MEAL_TIMINGS = ['Early Morning', 'Breakfast', 'Pre Workout', 'Post Workout', 'Lunch', 'Evening Snack', 'Dinner', 'Before Sleep'];

const INITIAL_FOOD_ITEMS = [
  { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, water: '250ml', timing: 'Lunch' },
  { id: 2, name: 'Eggs (Boiled)', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, water: '200ml', timing: 'Breakfast' },
  { id: 3, name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, water: '300ml', timing: 'Lunch' },
  { id: 4, name: 'Oats', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, water: '400ml', timing: 'Breakfast' },
  { id: 5, name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, water: '150ml', timing: 'Pre Workout' },
  { id: 6, name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, water: '100ml', timing: 'Evening Snack' },
  { id: 7, name: 'Milk', calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, water: '250ml', timing: 'Before Sleep' },
  { id: 8, name: 'Dry Fruits', calories: 600, protein: 20, carbs: 25, fat: 45, fiber: 7, water: '100ml', timing: 'Evening Snack' },
  { id: 9, name: 'Fish', calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, water: '200ml', timing: 'Dinner' },
  { id: 10, name: 'Paneer', calories: 265, protein: 18, carbs: 1.2, fat: 20, fiber: 0, water: '150ml', timing: 'Post Workout' },
  { id: 11, name: 'Salad', calories: 25, protein: 1.5, carbs: 5, fat: 0.2, fiber: 2.5, water: '200ml', timing: 'Lunch' },
  { id: 12, name: 'Egg Whites', calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, water: '150ml', timing: 'Breakfast' },
  { id: 13, name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, water: '100ml', timing: 'Evening Snack' },
  { id: 14, name: 'Banana Shake', calories: 250, protein: 8, carbs: 45, fat: 5, fiber: 3, water: '300ml', timing: 'Pre Workout' },
  { id: 15, name: 'Protein Smoothie', calories: 320, protein: 30, carbs: 35, fat: 6, fiber: 5, water: '400ml', timing: 'Post Workout' },
  { id: 16, name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, water: '100ml', timing: 'Evening Snack' },
  { id: 17, name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, water: '200ml', timing: 'Lunch' },
  { id: 18, name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, water: '150ml', timing: 'Lunch' },
  { id: 19, name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, water: '250ml', timing: 'Dinner' },
  { id: 20, name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, water: '100ml', timing: 'Breakfast' },
  { id: 21, name: 'Tuna', calories: 132, protein: 28, carbs: 0, fat: 1.3, fiber: 0, water: '150ml', timing: 'Lunch' },
  { id: 22, name: 'Multigrain Bread', calories: 265, protein: 9, carbs: 43, fat: 4, fiber: 7, water: '150ml', timing: 'Breakfast' },
  { id: 23, name: 'Whey Isolate', calories: 110, protein: 25, carbs: 2, fat: 0.5, fiber: 0, water: '300ml', timing: 'Post Workout' },
  { id: 24, name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, water: '150ml', timing: 'Before Sleep' },
  { id: 25, name: 'Mixed Fruits', calories: 50, protein: 0.5, carbs: 13, fat: 0.3, fiber: 2, water: '200ml', timing: 'Early Morning' },
];

const INITIAL_PRODUCT_ITEMS = [
  { id: 1, name: 'Vortex Whey Protein', brand: 'AlphaLabs', type: 'Protein', flavor: 'Chocolate Silicon', price: 5000, discount: 20, rating: 4.8, stock: 15, timing: 'Post Workout', quantity: '2kg', benefits: 'Muscle Recovery & Growth', image: '🧪' },
  { id: 2, name: 'Alpha Mass Gainer', brand: 'CyberBulk', type: 'Mass Gainer', flavor: 'Vanilla Velocity', price: 6000, discount: 15, rating: 4.5, stock: 10, timing: 'Post Workout', quantity: '5kg', benefits: 'Weight Gain & Size', image: '📦' },
  { id: 3, name: 'Quantum Creatine', brand: 'AlphaLabs', type: 'Creatine', flavor: 'Unflavored Blast', price: 1500, discount: 10, rating: 4.9, stock: 25, timing: 'Pre Workout', quantity: '300g', benefits: 'Strength & Power', image: '⚡' },
  { id: 4, name: 'Hyper Pre Workout', brand: 'NeonFuel', type: 'Pre Workout', flavor: 'Electric Lime', price: 3000, discount: 25, rating: 4.7, stock: 12, timing: 'Pre Workout', quantity: '250g', benefits: 'Energy & Focus', image: '🔥' },
  { id: 5, name: 'BCAA Fusion', brand: 'AlphaLabs', type: 'BCAA', flavor: 'Berry Boost', price: 2500, discount: 20, rating: 4.4, stock: 18, timing: 'Intra Workout', quantity: '400g', benefits: 'Endurance & Hydration', image: '💧' },
  { id: 6, name: 'Thermal Fat Burner', brand: 'NeonFuel', type: 'Fat Burner', flavor: 'Capsule', price: 2200, discount: 15, rating: 4.6, stock: 30, timing: 'Morning', quantity: '60 Caps', benefits: 'Metabolism & Fat Loss', image: '☄️' },
  { id: 7, name: 'Organic Peanut Butter', brand: 'NatureCore', type: 'Supplements', flavor: 'Crunchy Nut', price: 500, discount: 0, rating: 4.9, stock: 50, timing: 'Breakfast', quantity: '500g', benefits: 'Healthy Fats & Protein', image: '🥜' },
  { id: 8, name: 'Protein Bar Pack', brand: 'CyberBulk', type: 'Snacks', flavor: 'Caramel Crunch', price: 1200, discount: 10, rating: 4.7, stock: 45, timing: 'Snack', quantity: '12 Bars', benefits: 'Quick Protein Fix', image: '🍫' },
  { id: 9, name: 'Instant Rolled Oats', brand: 'NatureCore', type: 'Oats', flavor: 'Natural', price: 400, discount: 5, rating: 4.8, stock: 60, timing: 'Breakfast', quantity: '1kg', benefits: 'Fiber & Energy', image: '🥣' },
  { id: 10, name: 'Multi-Vite Shield', brand: 'HealthLink', type: 'Vitamins', flavor: 'Tablet', price: 1200, discount: 5, rating: 4.6, stock: 40, timing: 'Breakfast', quantity: '60 Caps', benefits: 'Immunity & Health', image: '💊' },
];

const INITIAL_USERS = [
  { id: 1, name: 'Alex Rivera', email: 'alex@ai.com', phone: '+1 234 567 890', plan: 'Premium', status: 'Active', joinDate: '2026-02-12', img: '👤' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@ai.com', phone: '+1 987 654 321', plan: 'Basic', status: 'Pending', joinDate: '2026-05-01', img: '👤' },
  { id: 3, name: 'Marcus Wright', email: 'marcus@ai.com', phone: '+1 555 000 111', plan: 'Standard', status: 'Blocked', joinDate: '2025-11-20', img: '👤' },
];

const ADMIN_DETAILS = {
  name: 'Admin Core',
  email: 'admin@gympro.ai',
  role: 'System Architect',
  avatar: 'A',
  lastLogin: '2026-05-09 08:30 AM'
};

const INITIAL_EXERCISES = [
  { id: 1, name: 'Neural Bench Press', category: 'Strength', sets: 4, reps: 10, difficulty: 'Expert', calories: 180, timing: '45m', image: '🏋️‍♂️' },
  { id: 2, name: 'Cyber Cardio Sprints', category: 'Cardio', sets: 1, reps: 15, difficulty: 'Intermediate', calories: 350, timing: '20m', image: '🏃‍♂️' },
];

function App() {
  // --- Core System States ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('gp_is_logged_in') === 'true';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gp_admin_theme');
    return saved === null ? true : saved === 'dark';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollaped] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, memberId: null, memberName: '' });
  const [systemPrefs, setSystemPrefs] = useState({
    notifications: true,
    sync: true,
    analytics: false
  });

  // --- Data States ---
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [products, setProducts] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('gp_cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('gp_wishlist')) || []);
  const [notifications, setNotifications] = useState([]);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, eRes, pRes, fRes, nRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users`),
          fetch(`${API_BASE_URL}/exercises`),
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/food`),
          fetch(`${API_BASE_URL}/notifications`)
        ]);

        const [uData, eData, pData, fData, nData] = await Promise.all([
          uRes.json(), eRes.json(), pRes.json(), fRes.json(), nRes.json()
        ]);

        // Merge users: prioritize database data over initial hardcoded data
        const mergedUsers = [...uData];
        INITIAL_USERS.forEach(iu => {
          if (!mergedUsers.find(item => item.id === iu.id)) {
            mergedUsers.push(iu);
          }
        });
        setUsers(mergedUsers);

        // Merge exercises: prioritize database data
        const mergedExercises = [...eData];
        INITIAL_EXERCISES.forEach(ie => {
          if (!mergedExercises.find(item => item.id === ie.id)) {
            mergedExercises.push(ie);
          }
        });
        setExercises(mergedExercises);

        // Merge products: prioritize database data
        const mergedProducts = [...pData];
        INITIAL_PRODUCT_ITEMS.forEach(ip => {
          if (!mergedProducts.find(item => item.id === ip.id)) {
            mergedProducts.push(ip);
          }
        });
        setProducts(mergedProducts);

        // Merge food items: prioritize database data
        const mergedFood = [...fData];
        INITIAL_FOOD_ITEMS.forEach(ifood => {
          if (!mergedFood.find(item => item.id === ifood.id)) {
            mergedFood.push(ifood);
          }
        });
        setFoodItems(mergedFood);
        setNotifications(nData.length > 0 ? nData : [
          { id: 1, title: 'System Online', message: 'Admin Intelligence Module active.', time: '08:00 AM', read: false, type: 'system' }
        ]);
      } catch (err) {
        console.error('Fetch error:', err);
        // Fallback to initial data if server is down
        setUsers(INITIAL_USERS);
        setExercises(INITIAL_EXERCISES);
        setProducts(INITIAL_PRODUCT_ITEMS);
        setFoodItems(INITIAL_FOOD_ITEMS);
      }
    };
    fetchData();
  }, []);

  // --- Effects (Persistence & Theme) ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('gp_admin_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('gp_cart', JSON.stringify(cart));
    localStorage.setItem('gp_wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

  // --- Cart & Pricing Logic ---
  const calculateFinalPrice = (price, discount) => {
    return Math.round(price - (price * (discount / 100)));
  };

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = cart.reduce((acc, item) => {
      const discountedPrice = calculateFinalPrice(item.price, item.discount);
      return acc + ((item.price - discountedPrice) * item.quantity);
    }, 0);
    const finalAmount = subtotal - totalDiscount;
    return { subtotal, totalDiscount, finalAmount };
  }, [cart]);

  // --- Handlers ---
  const [loginPassword, setLoginPassword] = useState('');

  const [loginError, setLoginError] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('gp_is_logged_in');
    addNotification('System Security', 'Admin session terminated successfully.', 'warning');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginPassword === '2006') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('gp_is_logged_in', 'true');
      addNotification('Access Granted', 'Neural synchronization established.', 'success');
    } else {
      setLoginError('Invalid Access Key. Neural synchronization failed.');
      addNotification('Access Denied', 'Invalid Access Key provided.', 'warning');
    }
  };

  const addToCart = (product, selectedQty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + selectedQty } : item);
      }
      return [...prev, { ...product, quantity: selectedQty }];
    });
    addNotification('GymPro Order', `${product.name} added to protocol.`, 'success');
  };

  const buyNow = (product) => {
    addToCart(product, 1);
    setActiveTab('store'); // Ensure we are on store to see cart
    // In a real app, this might redirect to checkout
    addNotification('Checkout Initialized', `Proceeding to secure payment for ${product.name}.`, 'info');
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      addNotification('Wishlist Sync', `${product.name} archived for later.`, 'info');
      return [...prev, product];
    });
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = { id: Date.now(), title, message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false, type };
    
    setNotifications(prev => {
      // Prevent spamming identical system updates
      if (prev.length > 0 && prev[0].title === title && prev[0].message === message) {
        return prev;
      }
      return [newNotif, ...prev];
    });

    // Auto-open notifications if it's a success/warning/error
    if (type !== 'info') setIsNotificationOpen(true);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.map(n => n.id === newNotif.id ? { ...n, read: true } : n));
    }, 5000);
  };

  const [foodForm, setFoodForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', water: '', timing: 'Lunch' });

  const addFoodItem = async (e) => {
    e.preventDefault();
    const tempId = Date.now();
    const newFood = { 
      ...foodForm, 
      id: tempId,
      calories: Number(foodForm.calories),
      protein: Number(foodForm.protein),
      carbs: Number(foodForm.carbs),
      fat: Number(foodForm.fat),
      fiber: Number(foodForm.fiber)
    };
    
    try {
      const res = await fetch(`${API_BASE_URL}/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFood)
      });
      if (res.ok) {
        const saved = await res.json();
        setFoodItems(prev => [...prev, saved]);
      } else {
        setFoodItems(prev => [...prev, newFood]);
      }
    } catch (err) {
      console.error('Add food error:', err);
      setFoodItems(prev => [...prev, newFood]);
    }
    
    setShowAddFoodModal(false);
    setFoodForm({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', water: '', timing: 'Lunch' });
    addNotification('Nutrition Sync', `${newFood.name} added to matrix.`, 'success');
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Execute deletion protocol for this item?`)) return;
    try {
      let endpoint = '';
      if (type === 'user') endpoint = 'users';
      if (type === 'exercise') endpoint = 'exercises';
      if (type === 'product') endpoint = 'products';
      if (type === 'food') endpoint = 'food';

      await fetch(`${API_BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' });

      if (type === 'user') setUsers(users.filter(u => u.id !== id));
      if (type === 'exercise') setExercises(exercises.filter(e => e.id !== id));
      if (type === 'product') setProducts(products.filter(p => p.id !== id));
      if (type === 'food') setFoodItems(foodItems.filter(f => f.id !== id));
      
      addNotification('Protocol Executed', 'Data purged from neural records.', 'warning');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const addMember = async (memberData) => {
    const tempId = Date.now();
    const newMemberData = { ...memberData, id: tempId };
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (res.ok) {
        const savedMember = await res.json();
        setUsers(prev => [savedMember, ...prev]);
      } else {
        setUsers(prev => [newMemberData, ...prev]);
      }
    } catch (err) {
      console.error('Add member error:', err);
      setUsers(prev => [newMemberData, ...prev]);
    }
    setShowAddModal(false);
    addNotification('Member Added', `${newMemberData.name} has been added successfully.`, 'success');
  };

  const updateMember = async (id, memberData) => {
    const updatedMemberData = { ...memberData, id };
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (res.ok) {
        const updatedMember = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? updatedMember : u));
        addNotification('Member Updated', `${updatedMemberData.name} has been updated.`, 'success');
      } else {
        // Fallback for UI if server update fails
        setUsers(prev => prev.map(u => u.id === id ? updatedMemberData : u));
        addNotification('Sync Warning', `${updatedMemberData.name} updated locally, but server sync failed.`, 'warning');
      }
    } catch (err) {
      console.error('Update member error:', err);
      setUsers(prev => prev.map(u => u.id === id ? updatedMemberData : u));
      addNotification('Sync Error', `Failed to sync update for ${updatedMemberData.name}.`, 'error');
    }
    setShowEditModal(false);
  };

  const updateExercise = async (id, exerciseData) => {
    const updatedExData = { ...exerciseData, id };
    try {
      const res = await fetch(`${API_BASE_URL}/exercises/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseData)
      });
      if (res.ok) {
        const updatedEx = await res.json();
        setExercises(prev => prev.map(e => e.id === id ? updatedEx : e));
        addNotification('Exercise Updated', `${updatedExData.name} has been updated.`, 'success');
      } else {
        setExercises(prev => prev.map(e => e.id === id ? updatedExData : e));
        addNotification('Sync Warning', `${updatedExData.name} updated locally, but server sync failed.`, 'warning');
      }
    } catch (err) {
      console.error('Update exercise error:', err);
      setExercises(prev => prev.map(e => e.id === id ? updatedExData : e));
      addNotification('Sync Error', `Failed to sync update for ${updatedExData.name}.`, 'error');
    }
    setShowEditExerciseModal(false);
  };

  const confirmDeleteMember = (id, name) => {
    setDeleteConfirm({ show: true, memberId: id, memberName: name });
  };

  const executeDeleteMember = async () => {
    if (deleteConfirm.memberId) {
      try {
        await fetch(`${API_BASE_URL}/users/${deleteConfirm.memberId}`, { method: 'DELETE' });
        setUsers(users.filter(u => u.id !== deleteConfirm.memberId));
        addNotification('Member Removed', `${deleteConfirm.memberName} has been removed.`, 'warning');
      } catch (err) {
        console.error('Delete member error:', err);
      }
      setDeleteConfirm({ show: false, memberId: null, memberName: '' });
    }
  };

  const updateUserStatus = async (id, newStatus) => {
    try {
      const userToUpdate = users.find(u => u.id === id);
      if (!userToUpdate) return;

      const updatedData = {
        ...userToUpdate,
        status: newStatus,
        // Ensure we use the field names the backend expects
        join_date: userToUpdate.join_date || userToUpdate.joinDate,
        expiry_date: userToUpdate.expiry_date || userToUpdate.expiryDate
      };
      // Remove the old camelCase keys if they exist to avoid confusion
      delete updatedData.joinDate;
      delete updatedData.expiryDate;

      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
        addNotification('Neural Sync', `User status updated to ${newStatus}.`, 'success');
      } else {
        // Fallback for UI if server update fails but we want to show change (or just handle error)
        setUsers(prev => prev.map(u => u.id === id ? { ...userToUpdate, status: newStatus } : u));
        addNotification('Sync Warning', 'Status updated locally, but server sync failed.', 'warning');
      }
    } catch (err) {
      console.error('Update error:', err);
      addNotification('Sync Error', 'Failed to update user status.', 'error');
    }
  };

  // --- Analytics Memo ---
  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeMembers: users.filter(u => u.status === 'Active').length,
    revenue: users.length * 1250, // Simulated logic
    pendingRequests: users.filter(u => u.status === 'Pending').length,
    plans: exercises.length,
    products: products.length,
    notifs: notifications.length,
    attendance: Math.floor(users.length * 0.65)
  }), [users, exercises, products, notifications]);

  // --- Sub-Components (Views) ---
  
  const DashboardView = () => (
    <div className="view-container fade-in">
      <div className="dashboard-header">
        <h1 className="neural-title">Operational Overview</h1>
        <div className="admin-welcome glass">
          <span>Welcome back, <strong>{ADMIN_DETAILS.name}</strong></span>
          <small>System status: Optimal</small>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { label: 'Total Users', val: stats.totalUsers, icon: '👤', color: 'blue' },
          { label: 'Active Members', val: stats.activeMembers, icon: '⚡', color: 'green' },
          { label: 'Total Revenue', val: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: 'purple' },
          { label: 'Membership Requests', val: stats.pendingRequests, icon: '💳', color: 'yellow' },
          { label: 'Workout Plans', val: stats.plans, icon: '🏋️‍♂️', color: 'cyan' },
          { label: 'Products', val: stats.products, icon: '🛒', color: 'pink' },
          { label: 'Notifications', val: stats.notifs, icon: '🔔', color: 'indigo' },
          { label: 'Today Attendance', val: stats.attendance, icon: '📍', color: 'orange' },
        ].map((s, i) => (
          <div key={i} className={`stat-card glass neon-${s.color}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <h3>{s.label}</h3>
              <p>{s.val}</p>
            </div>
            <div className="stat-chart-mini">
              <div className="bar" style={{height: '40%'}}></div>
              <div className="bar" style={{height: '70%'}}></div>
              <div className="bar" style={{height: '55%'}}></div>
              <div className="bar" style={{height: '90%'}}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-section">
        <div className="glass chart-card">
          <h3>Revenue Flow Matrix</h3>
          <div className="svg-chart">
            <svg viewBox="0 0 400 150">
              <path d="M0,120 Q50,80 100,100 T200,40 T300,70 T400,20" fill="none" stroke="var(--neon-blue)" strokeWidth="3" />
              <path d="M0,150 L0,120 Q50,80 100,100 T200,40 T300,70 T400,20 L400,150 Z" fill="url(#grad)" opacity="0.2" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor: 'var(--neon-blue)', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: 'var(--neon-blue)', stopOpacity: 0}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="glass recent-log">
          <h3>Neural Activity Feed</h3>
          <div className="log-list">
            {notifications.slice(0, 5).map(n => (
              <div key={n.id} className="log-item">
                <span className="log-time">{n.time}</span>
                <p><strong>{n.title}:</strong> {n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagementView = () => {
    const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = memberFilter === 'All' || u.status === memberFilter;
      const matchesPlan = planFilter === 'All' || u.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });

    const viewMember = (member) => {
      setSelectedMember(member);
      setShowViewModal(true);
    };

    const editMember = (member) => {
      setSelectedMember(member);
      setShowEditModal(true);
    };

    return (
      <div className="view-container fade-in">
        <div className="header-actions">
          <h1 className="neural-title">Member Management</h1>
        </div>

        <div className="member-filters glass">
          <div className="search-wrap">
            <input placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <span>🔍</span>
          </div>
          <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expired">Expired</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
            <option value="All">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Personal Training">Personal Training</option>
          </select>
          <button className="neon-btn add-member-btn" onClick={() => setShowAddModal(true)}>+ Add Member</button>
        </div>

        <div className="members-grid">
          {filteredUsers.map(u => (
            <div key={u.id} className="glass member-card fade-in">
              <div className="member-header">
                <div className="member-avatar">{u.img || '👤'}</div>
                <div className="member-info">
                  <h3>{u.name}</h3>
                  <span className="member-username">@{u.username || u.email.split('@')[0]}</span>
                </div>
                <span className={`status-badge ${u.status?.toLowerCase()}`}>{u.status}</span>
              </div>
              <div className="member-details">
                <div className="detail-row">
                  <span className="detail-label">📧</span>
                  <span>{u.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📱</span>
                  <span>{u.phone || 'Not provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📋</span>
                  <span className={`plan-badge ${u.plan?.toLowerCase().replace(' ', '-')}`}>{u.plan}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅</span>
                  <span>Joined on <strong>{u.join_date || u.joinDate}</strong></span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">⏰</span>
                  <span>Expires on <strong>{u.expiry_date || u.expiryDate || 'Lifetime'}</strong></span>
                </div>
              </div>
              <div className="member-actions">
                <button className="action-btn view" onClick={() => viewMember(u)}>View</button>
                <button className="action-btn edit" onClick={() => editMember(u)}>Edit</button>
                <button className="action-btn status" onClick={() => updateUserStatus(u.id, u.status === 'Active' ? 'Expired' : 'Active')}>
                  {u.status === 'Active' ? 'Expire' : 'Activate'}
                </button>
                <button className="action-btn delete" onClick={() => confirmDeleteMember(u.id, u.name)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="glass empty-state fade-in">
            <p>No members found matching your criteria.</p>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="modal-overlay fade-in" onClick={() => setShowAddModal(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Member</h2>
                <button className="close-modal" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addMember({
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  plan: formData.get('plan'),
                  status: formData.get('status'),
                  join_date: formData.get('join_date') || new Date().toISOString().split('T')[0],
                  expiry_date: formData.get('expiry_date') || null,
                  username: formData.get('username'),
                  img: '👤'
                });
              }}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" placeholder="Enter full name" required />
                  </div>
                  <div className="input-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter username" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Email *</label>
                    <input type="email" name="email" placeholder="Enter email address" required />
                  </div>
                  <div className="input-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" placeholder="Enter phone number" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Membership Plan *</label>
                    <select name="plan" required>
                      <option value="Basic">Basic Plan</option>
                      <option value="Standard">Standard Plan</option>
                      <option value="Premium">Premium Plan</option>
                      <option value="Personal Training">Personal Training</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Status *</label>
                    <select name="status" required>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Join Date</label>
                    <input type="date" name="join_date" />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input type="date" name="expiry_date" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="neon-btn">Create Member</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Member Modal */}
        {showViewModal && selectedMember && (
          <div className="modal-overlay fade-in" onClick={() => setShowViewModal(false)}>
            <div className="modal-container glass view-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Member Details</h2>
                <button className="close-modal" onClick={() => setShowViewModal(false)}>×</button>
              </div>
              <div className="member-profile">
                <div className="profile-avatar">{selectedMember.img || '👤'}</div>
                <h3>{selectedMember.name}</h3>
                <span className="profile-username">@{selectedMember.username || selectedMember.email?.split('@')[0]}</span>
                <span className={`status-badge large ${selectedMember.status?.toLowerCase()}`}>{selectedMember.status}</span>
              </div>
              <div className="profile-details">
                <div className="profile-row"><span>Email:</span><strong>{selectedMember.email}</strong></div>
                <div className="profile-row"><span>Phone:</span><strong>{selectedMember.phone || 'Not provided'}</strong></div>
                <div className="profile-row"><span>Plan:</span><strong>{selectedMember.plan}</strong></div>
                <div className="profile-row"><span>Join Date:</span><strong>{selectedMember.join_date || selectedMember.joinDate}</strong></div>
                <div className="profile-row"><span>Expiry:</span><strong>{selectedMember.expiry_date || selectedMember.expiryDate || 'Lifetime'}</strong></div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowViewModal(false)}>Close</button>
                <button className="neon-btn" onClick={() => { setShowViewModal(false); editMember(selectedMember); }}>Edit Member</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEditModal && selectedMember && (
          <div className="modal-overlay fade-in" onClick={() => setShowEditModal(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Member Details</h2>
                <button className="close-modal" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                updateMember(selectedMember.id, {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  plan: formData.get('plan'),
                  status: formData.get('status'),
                  join_date: formData.get('join_date') || selectedMember.join_date || selectedMember.joinDate,
                  expiry_date: formData.get('expiry_date') || null,
                  username: formData.get('username'),
                  img: selectedMember.img || '👤'
                });
              }}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" defaultValue={selectedMember.name} required />
                  </div>
                  <div className="input-group">
                    <label>Username</label>
                    <input type="text" name="username" defaultValue={selectedMember.username || selectedMember.email?.split('@')[0]} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Email *</label>
                    <input type="email" name="email" defaultValue={selectedMember.email} required />
                  </div>
                  <div className="input-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" defaultValue={selectedMember.phone} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Membership Plan *</label>
                    <select name="plan" defaultValue={selectedMember.plan} required>
                      <option value="Basic">Basic Plan</option>
                      <option value="Standard">Standard Plan</option>
                      <option value="Premium">Premium Plan</option>
                      <option value="Personal Training">Personal Training</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Status *</label>
                    <select name="status" defaultValue={selectedMember.status} required>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Join Date</label>
                    <input type="date" name="join_date" defaultValue={selectedMember.join_date || selectedMember.joinDate} />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input type="date" name="expiry_date" defaultValue={selectedMember.expiry_date || selectedMember.expiryDate} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="neon-btn">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="modal-overlay fade-in" onClick={() => setDeleteConfirm({ show: false, memberId: null, memberName: '' })}>
            <div className="modal-container glass confirm-modal" onClick={e => e.stopPropagation()}>
              <div className="confirm-icon">⚠️</div>
              <h2>Remove Member?</h2>
              <p>Are you sure you want to remove <strong>{deleteConfirm.memberName}</strong> from the system? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button className="cancel-btn" onClick={() => setDeleteConfirm({ show: false, memberId: null, memberName: '' })}>Cancel</button>
                <button className="confirm-delete-btn" onClick={executeDeleteMember}>Yes, Remove</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ExerciseView = () => {
    return (
      <div className="view-container fade-in">
        <div className="header-actions">
          <h1 className="neural-title">Exercise Matrix</h1>
          <button className="neon-btn add-member-btn" onClick={() => setShowAddExerciseModal(true)}>+ Add Exercise</button>
        </div>
        
        <div className="matrix-grid">
          {exercises.map(ex => (
            <div key={ex.id} className="glass matrix-card">
              <div className="card-header">
                <span className="ex-icon">{ex.image}</span>
                <div className="ex-head-info">
                  <h4>{ex.name}</h4>
                  <span className="difficulty">{ex.difficulty}</span>
                </div>
              </div>
              <div className="card-body">
                <p>Category: <strong>{ex.category}</strong></p>
                <p>Neural Sets: <strong>{ex.sets}x{ex.reps}</strong></p>
                <p>Energy Cost: <strong>{ex.calories} kcal</strong></p>
                <p>Timing: <strong>{ex.timing}</strong></p>
              </div>
              <div className="member-actions">
                <button className="action-btn edit" onClick={() => { setSelectedExercise(ex); setShowEditExerciseModal(true); }}>Edit</button>
                <button className="action-btn delete" onClick={() => deleteItem('exercise', ex.id)}>Purge</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Exercise Modal */}
        {showAddExerciseModal && (
          <div className="modal-overlay fade-in" onClick={() => setShowAddExerciseModal(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Deploy New Exercise</h2>
                <button className="close-modal" onClick={() => setShowAddExerciseModal(false)}>×</button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newEx = {
                  name: formData.get('name'),
                  category: formData.get('category'),
                  sets: Number(formData.get('sets')),
                  reps: Number(formData.get('reps')),
                  difficulty: formData.get('difficulty'),
                  calories: Number(formData.get('calories')),
                  timing: formData.get('timing'),
                  image: '🏋️‍♂️'
                };
                
                try {
                  const res = await fetch(`${API_BASE_URL}/exercises`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEx)
                  });
                  if (res.ok) {
                    const saved = await res.json();
                    setExercises(prev => [saved, ...prev]);
                    addNotification('Exercise Deployed', `${saved.name} added to training matrix.`, 'success');
                  } else {
                    const tempEx = { ...newEx, id: Date.now() };
                    setExercises(prev => [tempEx, ...prev]);
                    addNotification('Sync Warning', `${newEx.name} added locally, but server sync failed.`, 'warning');
                  }
                } catch (err) {
                  console.error('Add exercise error:', err);
                  addNotification('Sync Error', 'Failed to deploy exercise protocol.', 'error');
                }
                setShowAddExerciseModal(false);
              }}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Exercise Name</label>
                    <input name="name" placeholder="Enter exercise name..." required />
                  </div>
                  <div className="input-group">
                    <label>Category</label>
                    <select name="category">
                      {EXERCISE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Sets</label>
                    <input type="number" name="sets" placeholder="0" />
                  </div>
                  <div className="input-group">
                    <label>Reps</label>
                    <input type="number" name="reps" placeholder="0" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Difficulty</label>
                    <select name="difficulty">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Calories</label>
                    <input type="number" name="calories" placeholder="0" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Timing (e.g. 45m)</label>
                    <input name="timing" placeholder="Duration" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddExerciseModal(false)}>Cancel</button>
                  <button type="submit" className="neon-btn">Deploy Exercise</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Exercise Modal */}
        {showEditExerciseModal && selectedExercise && (
          <div className="modal-overlay fade-in" onClick={() => setShowEditExerciseModal(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Update Exercise Protocol</h2>
                <button className="close-modal" onClick={() => setShowEditExerciseModal(false)}>×</button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                updateExercise(selectedExercise.id, {
                  name: formData.get('name'),
                  category: formData.get('category'),
                  sets: Number(formData.get('sets')),
                  reps: Number(formData.get('reps')),
                  difficulty: formData.get('difficulty'),
                  calories: Number(formData.get('calories')),
                  timing: formData.get('timing'),
                  image: selectedExercise.image
                });
              }}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Exercise Name</label>
                    <input name="name" defaultValue={selectedExercise.name} required />
                  </div>
                  <div className="input-group">
                    <label>Category</label>
                    <select name="category" defaultValue={selectedExercise.category}>
                      {EXERCISE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Sets</label>
                    <input type="number" name="sets" defaultValue={selectedExercise.sets} />
                  </div>
                  <div className="input-group">
                    <label>Reps</label>
                    <input type="number" name="reps" defaultValue={selectedExercise.reps} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Difficulty</label>
                    <select name="difficulty" defaultValue={selectedExercise.difficulty}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Calories</label>
                    <input type="number" name="calories" defaultValue={selectedExercise.calories} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Timing</label>
                    <input name="timing" defaultValue={selectedExercise.timing} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={() => setShowEditExerciseModal(false)}>Cancel</button>
                  <button type="submit" className="neon-btn">Update Protocol</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const NutritionMatrixView = () => (
    <div className="view-container fade-in">
      <div className="header-actions">
        <h1 className="neural-title">Nutrition Matrix</h1>
        <button className="neon-btn add-food-btn" onClick={() => setShowAddFoodModal(true)}>
          + ADD FOOD PROTOCOL
        </button>
      </div>
      <div className="stats-grid">
        {[
          { label: 'Avg Calories', val: '2,450 kcal', icon: '🔥', color: 'orange' },
          { label: 'Avg Protein', val: '185g', icon: '🥩', color: 'red' },
          { label: 'Water Target', val: '4.5L', icon: '💧', color: 'blue' },
          { label: 'Fiber Goal', val: '35g', icon: '🌾', color: 'green' },
        ].map((s, i) => (
          <div key={i} className={`stat-card glass neon-${s.color} hover-glow`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <h3>{s.label}</h3>
              <p>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass table-wrapper">
        <table className="neural-table">
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Timing</th>
              <th>Macros (P/C/F)</th>
              <th>Calories</th>
              <th>Fiber</th>
              <th>Hydration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map(f => (
              <tr key={f.id}>
                <td><strong>{f.name}</strong></td>
                <td><span className="status-tag active">{f.timing}</span></td>
                <td>
                  <div className="macro-stats">
                    <span style={{color: 'var(--neon-blue)'}}>P: {f.protein}g</span>
                    <span style={{color: 'var(--neon-purple)'}}>C: {f.carbs}g</span>
                    <span style={{color: 'var(--neon-orange)'}}>F: {f.fat}g</span>
                  </div>
                </td>
                <td>{f.calories} kcal</td>
                <td>{f.fiber}g</td>
                <td><span className="water-hint">{f.water}</span></td>
                <td><button className="btn-delete" onClick={() => deleteItem('food', f.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProductStoreView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterType] = useState('All');
    const [priceRange, setPriceRange] = useState(10000);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterCategory === 'All' || p.type === filterCategory) &&
      p.price <= priceRange
    );

    return (
      <div className="view-container fade-in">
        <div className="header-actions">
          <h1 className="neural-title">GymPro</h1>
          <button className="cart-trigger" onClick={() => setIsCartOpen(true)}>
            🛒 Neural Cart ({cart.length})
          </button>
        </div>

        <div className="store-controls glass">
          <div className="search-wrap">
            <input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select value={filterCategory} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All Categories</option>
            {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="price-filter">
            <label>Max Price: ₹{priceRange}</label>
            <input type="range" min="0" max="10000" step="100" value={priceRange} onChange={e => setPriceRange(e.target.value)} />
          </div>
        </div>

        <div className="matrix-grid">
          {filteredProducts.map(p => {
            const finalPrice = calculateFinalPrice(p.price, p.discount);
            const inWishlist = wishlist.find(w => w.id === p.id);
            
            return (
              <div key={p.id} className="glass matrix-card neon-blue product-card-buy">
                <div className="card-badge">-{p.discount}% OFF</div>
                <div className="product-image-container">{p.image}</div>
                <div className="card-header">
                  <div className="ex-head-info">
                    <h4>{p.name}</h4>
                    <span className="brand-name">{p.brand}</span>
                  </div>
                  <button className={`wish-btn ${inWishlist ? 'active' : ''}`} onClick={() => toggleWishlist(p)}>
                    {inWishlist ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="card-body">
                  <div className="price-row">
                    <span className="original-price">₹{p.price}</span>
                    <span className="final-price">₹{finalPrice}</span>
                  </div>
                  <div className="rating">⭐ {p.rating} | 📦 {p.stock > 0 ? `${p.stock} In Stock` : 'Out of Stock'}</div>
                  <div className="usage-info">
                    <p>🕒 Best Time: <strong>{p.timing}</strong></p>
                    <p>⚖️ Serving: <strong>{p.quantity}</strong></p>
                  </div>
                </div>
                <div className="card-footer product-actions">
                  <button className="buy-now-btn" onClick={() => { buyNow(p); setIsCartOpen(true); }}>BUY NOW</button>
                  <button className="add-cart-btn" onClick={() => addToCart(p)}>ADD TO CART</button>
                </div>
              </div>
            );
          })}
        </div>

        {isCartOpen && (
          <div className="cart-overlay glass fade-in">
            <div className="cart-modal glass">
              <div className="cart-header">
                <h2>GymPro Order Cart</h2>
                <button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button>
              </div>
              <div className="cart-items">
                {cart.length === 0 ? <p className="empty-msg">Cart is empty. Select products.</p> : 
                  cart.map(item => (
                    <div key={item.id} className="cart-item glass">
                      <span className="item-icon">{item.image}</span>
                      <div className="item-info">
                        <strong>{item.name}</strong>
                        <span>₹{calculateFinalPrice(item.price, item.discount)} × {item.quantity}</span>
                      </div>
                      <div className="item-qty">
                        <button onClick={() => updateCartQty(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, 1)}>+</button>
                      </div>
                      <button className="remove-item" onClick={() => setCart(cart.filter(i => i.id !== item.id))}>🗑️</button>
                    </div>
                  ))
                }
              </div>
              <div className="cart-footer-summary">
                <div className="summary-row"><span>Subtotal:</span> <span>₹{cartTotals.subtotal}</span></div>
                <div className="summary-row discount"><span>Total Discount:</span> <span>-₹{cartTotals.totalDiscount}</span></div>
                <div className="summary-row final"><span>Final Order Amount:</span> <span>₹{cartTotals.finalAmount}</span></div>
                <button className="checkout-btn neon-btn">EXECUTE CHECKOUT</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const NaturalIntelligenceView = () => (
    <div className="view-container fade-in">
      <h1 className="neural-title">Natural Intelligence System</h1>
      
      <div className="analytics-grid">
        <div className="glass intel-card neon-blue">
          <div className="intel-header">
            <span className="intel-icon">🧠</span>
            <h3>Neural Performance Analysis</h3>
          </div>
          <div className="intel-content">
            <div className="prediction-item">
              <span>Member Growth Trend</span>
              <div className="progress-bar"><div className="fill" style={{width: '75%'}}></div></div>
              <span className="val">+12.5% Optimal</span>
            </div>
            <div className="prediction-item">
              <span>Retention Probability</span>
              <div className="progress-bar"><div className="fill" style={{width: '92%'}}></div></div>
              <span className="val">High Accuracy</span>
            </div>
          </div>
        </div>

        <div className="glass intel-card neon-purple">
          <div className="intel-header">
            <span className="intel-icon">⚡</span>
            <h3>Dynamic Energy Matrix</h3>
          </div>
          <div className="intel-body">
             <div className="matrix-stat">
               <span className="label">Peak Traffic</span>
               <span className="value">06:00 PM - 09:00 PM</span>
             </div>
             <div className="matrix-stat">
               <span className="label">Resource Efficiency</span>
               <span className="value">98.4%</span>
             </div>
          </div>
        </div>

        <div className="glass intel-card neon-green">
          <div className="intel-header">
            <span className="intel-icon">🥗</span>
            <h3>Bio-Nutrition Sync</h3>
          </div>
          <p className="intel-text">AI recommends increasing Protein stock by 15% for the upcoming summer phase based on neural consumption patterns.</p>
        </div>

        <div className="glass intel-card neon-orange">
          <div className="intel-header">
            <span className="intel-icon">🏋️‍♂️</span>
            <h3>Training Optimization</h3>
          </div>
          <p className="intel-text">Neural Bench Press is the most effective protocol this month. Recommend adding more Strength slots.</p>
        </div>
      </div>

      <div className="analytics-section">
        <div className="glass chart-card">
          <h3>Real-time Neural Load</h3>
          <div className="svg-chart">
            <svg viewBox="0 0 400 150">
              <path d="M0,120 L40,100 L80,110 L120,60 L160,80 L200,30 L240,50 L280,20 L320,40 L360,10 L400,30" fill="none" stroke="var(--neon-green)" strokeWidth="3" />
              <circle cx="400" cy="30" r="5" fill="var(--neon-green)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => {
    const togglePref = (key) => {
      setSystemPrefs(prev => ({ ...prev, [key]: !prev[key] }));
      addNotification('System Update', `Preference ${key.toUpperCase()} modified.`, 'info');
    };

    return (
      <div className="view-container fade-in">
        <h1 className="neural-title">System Settings</h1>
        <div className="settings-grid">
          <div className="glass settings-card admin-details-section">
            <h3>Admin Profile Details</h3>
            <div className="admin-detail-item">
              <div className="detail-label">Name</div>
              <div className="detail-value">{ADMIN_DETAILS.name}</div>
            </div>
            <div className="admin-detail-item">
              <div className="detail-label">Email</div>
              <div className="detail-value">{ADMIN_DETAILS.email}</div>
            </div>
            <div className="admin-detail-item">
              <div className="detail-label">Role</div>
              <div className="detail-value">{ADMIN_DETAILS.role}</div>
            </div>
            <div className="admin-detail-item">
              <div className="detail-label">Last Synchronization</div>
              <div className="detail-value">{ADMIN_DETAILS.lastLogin}</div>
            </div>
            <button className="neon-btn edit-profile-btn" onClick={() => addNotification('Profile Protocol', 'Updating admin profile is currently restricted.', 'warning')}>
              UPDATE PROFILE
            </button>
          </div>
          
          <div className="glass settings-card">
            <h3>System Preferences</h3>
            <div className="setting-toggle">
              <span>Neural Notifications</span>
              <button 
                className={`toggle-btn ${systemPrefs.notifications ? 'active' : ''}`}
                onClick={() => togglePref('notifications')}
              >
                {systemPrefs.notifications ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="setting-toggle">
              <span>Real-time Sync</span>
              <button 
                className={`toggle-btn ${systemPrefs.sync ? 'active' : ''}`}
                onClick={() => togglePref('sync')}
              >
                {systemPrefs.sync ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="setting-toggle">
              <span>Advanced Analytics</span>
              <button 
                className={`toggle-btn ${systemPrefs.analytics ? 'active' : ''}`}
                onClick={() => togglePref('analytics')}
              >
                {systemPrefs.analytics ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className={`login-page fade-in ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="glass login-card">
          <div className="logo-box center">
            <div className="neon-hex">GP</div>
            <span>GYM PRO AI</span>
          </div>
          <h2>Access Restricted</h2>
          <p>Initialize neural synchronization to access the command hub.</p>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Admin Protocol ID</label>
              <input type="text" placeholder="admin@gympro.ai" readOnly value="admin@gympro.ai" />
            </div>
            <div className="input-group">
              <label>Access Key</label>
              <input 
                type="password" 
                placeholder="1234" 
                required 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
              />
            </div>
            {loginError && <p className="login-error-msg" style={{color: 'var(--neon-pink)', fontSize: '0.8rem', marginTop: '-10px', fontWeight: 'bold'}}>{loginError}</p>}
            <button type="submit" className="neon-btn">ESTABLISH CONNECTION</button>
          </form>
          <div className="login-footer">
            <span>System Status: <strong style={{color: 'var(--neon-green)'}}>ONLINE</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-portal ${isDarkMode ? 'dark' : 'light'} ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* --- Sidebar --- */}
      <aside className="neural-sidebar">
        <div className="sidebar-header">
          <div className="logo-box">
            <div className="neon-hex">GP</div>
            {!sidebarCollapsed && <span>GYM PRO AI</span>}
          </div>
          <button className="collapse-toggle" onClick={() => setSidebarCollaped(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'users', label: 'Members', icon: '👤' },
            { id: 'exercises', label: 'Training', icon: '💪' },
            { id: 'nutrition', label: 'Nutrition Matrix', icon: '🥗' },
            { id: 'store', label: 'GymPro', icon: '🛒' },
            { id: 'analytics', label: 'Natural Intel', icon: '📈' },
            { id: 'settings', label: 'Systems', icon: '⚙️' },
          ].map(item => (
            <button 
              key={item.id} 
              className={activeTab === item.id ? 'active' : ''} 
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-switch" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '🌙' : '☀️'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span className="nav-label">TERMINATE</span>}
          </button>
        </div>
      </aside>

      {/* --- Main Workspace --- */}
      <main className="neural-workspace">
        <header className="workspace-header glass">
          <div className="breadcrumb">
            SYSTEM / <span>{activeTab.toUpperCase()}</span>
          </div>
          <div className="header-tools">
            <div className="notif-bell" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
              🔔 {notifications.filter(n => !n.read).length > 0 && <span className="notif-badge"></span>}
            </div>
            <div className="admin-profile">
              <div className="admin-info-text">
                <span className="admin-name">{ADMIN_DETAILS.name}</span>
                <span className="admin-role">{ADMIN_DETAILS.role}</span>
              </div>
              <div className="admin-avatar">{ADMIN_DETAILS.avatar}</div>
            </div>
          </div>

          {/* Notification Overlay */}
          {isNotificationOpen && (
            <div className="notif-overlay glass fade-in">
              <div className="notif-header">
                <h3>System Alerts</h3>
                <button onClick={() => setNotifications([])}>Clear All</button>
              </div>
              <div className="notif-scroll">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-entry ${n.read ? 'read' : 'unread'} ${n.type}`}>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{n.time}</small>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifs">
                    <p>No active alerts in the system.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        <section className="workspace-content">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'users' && <UserManagementView />}
          {activeTab === 'exercises' && <ExerciseView />}
          {activeTab === 'nutrition' && <NutritionMatrixView />}
          {activeTab === 'store' && <ProductStoreView />}
          {activeTab === 'analytics' && <NaturalIntelligenceView />}
          {activeTab === 'settings' && <SettingsView />}
          
          {/* Add Food Modal */}
          {showAddFoodModal && (
            <div className="modal-overlay glass fade-in">
              <div className="modal-content glass">
                <div className="modal-header">
                  <h2>Deploy New Food Protocol</h2>
                  <button className="close-btn" onClick={() => setShowAddFoodModal(false)}>×</button>
                </div>
                <form onSubmit={addFoodItem} className="neural-form">
                  <div className="input-group">
                    <label>Food Item Name</label>
                    <input 
                      placeholder="e.g. Grilled Salmon" 
                      value={foodForm.name} 
                      onChange={e => setFoodForm({...foodForm, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Timing</label>
                      <select value={foodForm.timing} onChange={e => setFoodForm({...foodForm, timing: e.target.value})}>
                        {MEAL_TIMINGS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Calories (kcal)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={foodForm.calories} 
                        onChange={e => setFoodForm({...foodForm, calories: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-row-triple">
                    <div className="input-group">
                      <label>Protein (g)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={foodForm.protein} 
                        onChange={e => setFoodForm({...foodForm, protein: e.target.value})} 
                      />
                    </div>
                    <div className="input-group">
                      <label>Carbs (g)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={foodForm.carbs} 
                        onChange={e => setFoodForm({...foodForm, carbs: e.target.value})} 
                      />
                    </div>
                    <div className="input-group">
                      <label>Fat (g)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={foodForm.fat} 
                        onChange={e => setFoodForm({...foodForm, fat: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="input-group">
                      <label>Fiber (g)</label>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={foodForm.fiber} 
                        onChange={e => setFoodForm({...foodForm, fiber: e.target.value})} 
                      />
                    </div>
                    <div className="input-group">
                      <label>Hydration Hint</label>
                      <input 
                        placeholder="e.g. 250ml" 
                        value={foodForm.water} 
                        onChange={e => setFoodForm({...foodForm, water: e.target.value})} 
                      />
                    </div>
                  </div>
                  <button type="submit" className="neon-btn">INITIALIZE PROTOCOL</button>
                </form>
              </div>
            </div>
          )}
          
          {['memberships'].includes(activeTab) && (
            <div className="coming-soon glass fade-in">
              <div className="neural-loader"></div>
              <h2>Module "{activeTab.toUpperCase()}" Under Optimization</h2>
              <p>Neural synchronization in progress. Returning to dashboard recommended.</p>
              <button className="neon-btn" onClick={() => setActiveTab('dashboard')}>RETURN TO HUB</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
