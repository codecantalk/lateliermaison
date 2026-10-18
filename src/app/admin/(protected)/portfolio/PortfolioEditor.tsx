'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export default function PortfolioEditor({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'Architecture', image_url: '', sort_order: 0 });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    item?: any;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const supabase = createClient();
  const router = useRouter();

  const requestDelete = (item: any) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Portfolio Item',
      message: `Are you sure you want to delete "${item.title}" from the portfolio gallery?`,
      item,
    });
  };

  const executeDelete = async () => {
    if (!confirmModal.item) return;
    const id = confirmModal.item.id;
    await supabase.from('portfolio_items').delete().eq('id', id);
    setItems(items.filter(item => item.id !== id));
    setConfirmModal({ isOpen: false, title: '', message: '' });
    router.refresh();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('portfolio_items').insert([newItem]).select();
    
    if (error) {
      alert(error.message);
      return;
    }

    if (data && data.length > 0) {
      setItems([...items, data[0]]);
      setIsAdding(false);
      setNewItem({ title: '', category: 'Architecture', image_url: '', sort_order: 0 });
      router.refresh();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3>Current Images</h3>
        <button className={styles.primaryBtn} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : '+ Add New Image'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className={styles.recentBookings} style={{ marginBottom: '2rem' }}>
          <h4>Add New Portfolio Item</h4>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Title / Project Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. The Glass House" 
                value={newItem.title}
                onChange={e => setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Location / Category</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Atlanta, GA" 
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Image URL (or local path)</label>
              <input 
                type="text" 
                required 
                placeholder="/luxury-hero.jpg" 
                value={newItem.image_url}
                onChange={e => setNewItem({...newItem, image_url: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className={styles.primaryBtn}>Save Item</button>
        </form>
      )}

      <div className={styles.recentBookings}>
        {items.length === 0 ? (
          <p>No portfolio items found. Add some to display them on the live site!</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image_url} alt={item.title} className={styles.imageCell} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.category}</td>
                  <td>
                    <button onClick={() => requestDelete(item)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, title: '', message: '' })}
        onConfirm={executeDelete}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Yes, Delete"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
