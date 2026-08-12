-- Supabase Schema for Radhe Investments

-- Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    gwp TEXT NOT NULL,
    policies INTEGER NOT NULL,
    active_clients INTEGER NOT NULL,
    type TEXT NOT NULL,
    parent_id TEXT REFERENCES agents(id)
);

-- Insert Mock Agents
INSERT INTO agents (id, name, role, gwp, policies, active_clients, type, parent_id) VALUES
('RADHE001', 'Radhe', 'Top Leader', '₹125.5 Cr', 1420, 1350, 'leader', NULL),
('LDR001', 'Amit Desai', 'Team Leader', '₹45.2 Cr', 512, 490, 'sub', 'RADHE001'),
('LDR002', 'Priya Singh', 'Team Leader', '₹38.8 Cr', 420, 405, 'sub', 'RADHE001'),
('AGT101', 'Karan Mehra', 'Sub-Agent', '₹12.1 Cr', 145, 140, 'sub', 'LDR001'),
('AGT102', 'Sneha Patel', 'Sub-Agent', '₹9.4 Cr', 110, 105, 'sub', 'LDR001');

-- Create Claims Table
CREATE TABLE IF NOT EXISTS claims (
    policy_number TEXT PRIMARY KEY,
    policyholder_name TEXT NOT NULL,
    coverage_type TEXT NOT NULL,
    total_sum_insured TEXT NOT NULL,
    approval_date TEXT NOT NULL,
    total_approved_amount TEXT NOT NULL,
    itemized_details JSONB NOT NULL
);

-- Insert Mock Claims
INSERT INTO claims (policy_number, policyholder_name, coverage_type, total_sum_insured, approval_date, total_approved_amount, itemized_details) VALUES
('POL-98231', 'Rahul Sharma', 'Comprehensive Health', '₹10,00,000', '24 Oct, 2023', '₹1,67,500', '[{"label": "Hospitalization Charges", "amount": "₹1,45,000"}, {"label": "Pharmacy & Medicines", "amount": "₹22,500"}]'),
('POL-12345', 'Anjali Verma', 'Life Insurance', '₹50,00,000', '02 Nov, 2023', '₹50,00,000', '[{"label": "Death Benefit Payout", "amount": "₹50,00,000"}]');
