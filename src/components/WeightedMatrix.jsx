import React, { useState } from 'react';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_CRITERIA = [
    { id: 'c1', name: 'Strategic Fit', weight: 4 },
    { id: 'c2', name: 'Revenue Impact', weight: 5 },
    { id: 'c3', name: 'Customer Satisf.', weight: 3 },
    { id: 'c4', name: 'Effort/Cost', weight: -3 } // Negative weight for effort
];

export default function WeightedMatrix() {
    const [criteria, setCriteria] = useLocalStorage('pm-weighted-criteria', DEFAULT_CRITERIA);
    const [items, setItems] = useLocalStorage('pm-weighted-items', []);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [showConfig, setShowConfig] = useState(false);

    const calculateTotal = (itemScores) => {
        return criteria.reduce((total, crit) => {
            const score = itemScores[crit.id] || 0;
            return total + (score * crit.weight);
        }, 0);
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItemTitle.trim()) return;

        setItems([
            ...items,
            { id: crypto.randomUUID(), title: newItemTitle.trim(), scores: {} }
        ]);
        setNewItemTitle('');
    };

    const updateItemScore = (itemId, criteriaId, value) => {
        setItems(items.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    scores: { ...item.scores, [criteriaId]: Number(value) }
                };
            }
            return item;
        }));
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleCriteriaUpdate = (id, field, value) => {
        setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    // Sort items by calculated total descending
    const sortedItems = [...items].sort((a, b) => calculateTotal(b.scores) - calculateTotal(a.scores));

    return (
        <div className="animate-fade-in glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ marginBottom: '8px' }}>Weighted Scoring Matrix</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
                        Evaluate initiatives against specific criteria. Each criterion has a weight multiplier.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowConfig(!showConfig)}
                        style={{ background: showConfig ? 'rgba(255,255,255,0.1)' : '' }}
                    >
                        <Settings2 size={18} /> Configure Criteria
                    </button>
                </div>
            </div>

            {showConfig && (
                <div className="animate-fade-in" style={{
                    background: 'var(--bg-secondary)',
                    padding: '24px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex', flexDirection: 'column', gap: '16px'
                }}>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Matrix Configuration
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {criteria.map(c => (
                            <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ flex: 1 }}
                                    value={c.name}
                                    onChange={(e) => handleCriteriaUpdate(c.id, 'name', e.target.value)}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    <span>Weight</span>
                                    <input
                                        type="number"
                                        className="input-field"
                                        style={{ width: '60px', padding: '6px' }}
                                        value={c.weight}
                                        onChange={(e) => handleCriteriaUpdate(c.id, 'weight', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        * Negative weights are useful for Effort, Complexity, or Cost where higher numbers are worse.
                    </p>
                </div>
            )}

            <form onSubmit={addItem} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <input
                    className="input-field"
                    type="text"
                    placeholder="New Initiative Title..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    style={{ width: '300px' }}
                />
                <button type="submit" className="btn btn-primary">
                    <Plus size={18} /> Add Initiative
                </button>
            </form>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '16px', minWidth: '200px' }}>Initiative</th>
                            {criteria.map(c => (
                                <th key={c.id} style={{ padding: '16px', textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'normal', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '12px', display: 'inline-block' }}>
                                        Weight: {c.weight > 0 ? '+' : ''}{c.weight}x
                                    </div>
                                </th>
                            ))}
                            <th style={{ padding: '16px', textAlign: 'center', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>Total Score</th>
                            <th style={{ padding: '16px', width: '60px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((item, index) => {
                            const total = calculateTotal(item.scores);
                            return (
                                <tr
                                    key={item.id}
                                    style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <td style={{ padding: '16px', fontWeight: 500 }}>{item.title}</td>
                                    {criteria.map(c => (
                                        <td key={c.id} style={{ padding: '16px', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                className="input-field"
                                                placeholder="0-10"
                                                min="0"
                                                max="10"
                                                style={{ width: '60px', padding: '6px', textAlign: 'center' }}
                                                value={item.scores[c.id] || ''}
                                                onChange={(e) => updateItemScore(item.id, c.id, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td style={{ padding: '16px', textAlign: 'center', background: 'rgba(99, 102, 241, 0.05)' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{total}</div>
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
                            );
                        })}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={criteria.length + 3} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
                                    No initiatives to score. Add one above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
