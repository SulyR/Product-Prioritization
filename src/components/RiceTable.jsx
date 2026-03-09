import React, { useState } from 'react';
import { Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function RiceTable() {
    const [items, setItems] = useLocalStorage('pm-rice-items', []);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });

    const calculateScore = (reach, impact, confidence, effort) => {
        // RICE = (Reach * Impact * Confidence%) / Effort
        // Assuming Confidence is a percentage (e.g., 80 for 80%)
        if (!effort || effort <= 0) return 0;
        const score = (reach * impact * (confidence / 100)) / effort;
        return Number(score.toFixed(2));
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                title: newItemTitle.trim(),
                reach: 100,
                impact: 3,
                confidence: 80,
                effort: 2,
                score: calculateScore(100, 3, 80, 2)
            }
        ]);
        setNewItemTitle('');
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: Number(value) };
                updatedItem.score = calculateScore(
                    updatedItem.reach,
                    updatedItem.impact,
                    updatedItem.confidence,
                    updatedItem.effort
                );
                return updatedItem;
            }
            return item;
        }));
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const sortedItems = [...items].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="animate-fade-in glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ marginBottom: '8px' }}>RICE Scoring</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
                        Calculate priorities using Reach, Impact, Confidence, and Effort.
                        <br /><br />
                        <strong>Score = (Reach × Impact × Confidence%) ÷ Effort</strong>
                    </p>
                </div>

                <form onSubmit={addItem} style={{ display: 'flex', gap: '12px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--border-radius-md)' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Initiative Title..."
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            style={{ width: '250px' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center' }}>
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px', width: '30%' }}>Initiative</th>
                            <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => requestSort('reach')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Reach <ArrowUpDown size={14} /></div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.7 }}>People/Events per time</div>
                            </th>
                            <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => requestSort('impact')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Impact <ArrowUpDown size={14} /></div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.7 }}>3=Massive, 2=High, 1=Med, 0.5=Low</div>
                            </th>
                            <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => requestSort('confidence')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Confidence% <ArrowUpDown size={14} /></div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.7 }}>High=100, Med=80, Low=50</div>
                            </th>
                            <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => requestSort('effort')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Effort <ArrowUpDown size={14} /></div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.7 }}>Person-months</div>
                            </th>
                            <th style={{ padding: '16px', cursor: 'pointer', background: 'rgba(99, 102, 241, 0.1)' }} onClick={() => requestSort('score')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)' }}>RICE Score <ArrowUpDown size={14} /></div>
                            </th>
                            <th style={{ padding: '16px', width: '60px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((item, index) => (
                            <tr
                                key={item.id}
                                style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <td style={{ padding: '16px', fontWeight: 500 }}>{item.title}</td>
                                <td style={{ padding: '16px' }}>
                                    <input
                                        type="number"
                                        className="input-field"
                                        style={{ width: '80px', padding: '6px' }}
                                        value={item.reach}
                                        onChange={(e) => updateItem(item.id, 'reach', e.target.value)}
                                    />
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <input
                                        type="number"
                                        step="0.25"
                                        className="input-field"
                                        style={{ width: '80px', padding: '6px' }}
                                        value={item.impact}
                                        onChange={(e) => updateItem(item.id, 'impact', e.target.value)}
                                    />
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <input
                                        type="number"
                                        className="input-field"
                                        style={{ width: '80px', padding: '6px' }}
                                        value={item.confidence}
                                        onChange={(e) => updateItem(item.id, 'confidence', e.target.value)}
                                    /> %
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <input
                                        type="number"
                                        step="0.5"
                                        className="input-field"
                                        style={{ width: '80px', padding: '6px' }}
                                        value={item.effort}
                                        onChange={(e) => updateItem(item.id, 'effort', e.target.value)}
                                    />
                                </td>
                                <td style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.05)' }}>
                                    <div style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        color: item.score > 200 ? 'var(--success)' : item.score > 50 ? 'var(--info)' : 'var(--text-primary)'
                                    }}>
                                        {item.score}
                                    </div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                                    No initiatives added yet. Add one above to start scoring!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
