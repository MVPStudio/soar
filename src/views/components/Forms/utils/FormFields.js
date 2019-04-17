import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export const Input = ({ label, input, type, meta }) => {
    return (
        <Form.Group>
            {renderLabel(label)}
            <Form.Control 
                type={type} 
                onChange={input.onChange} 
                value={input.value} 
            />
            { 
                meta.error && meta.touched && 
                renderErrorText(label, meta.error)
            }
        </Form.Group>
    );
};

export const TextArea = ({ label, input, type, meta, rows, placeholder }) => {
    return (
        <Form.Group>
            {renderLabel(label)}
            <Form.Control 
                type={type} 
                onChange={input.onChange} 
                value={input.value} 
                placeholder={placeholder}
                as="textarea"
                rows={rows}
            />
            { 
                meta.error && meta.touched && 
                renderErrorText(label, meta.error)
            }
        </Form.Group>
    );
};

export const Select = ({ label, input, type, meta, children }) => {
    return (
        <Form.Group>
            {renderLabel(label)}
            <Form.Control 
                type={type} 
                onChange={input.onChange} 
                value={input.value} 
                as="select"
            >
                {children}
            </Form.Control>
            { 
                meta.error && meta.touched && 
                renderErrorText(label, meta.error)
            }
        </Form.Group>
    );
};

export const SelectMultiple = ({ label, input, type, meta, children }) => {
    return (
        <Form.Group>
            {renderLabel(label)}
            <Form.Control 
                type={type} 
                onChange={input.onChange} 
                value={input.value} 
                as="select"
                multiple
            >
                {children}
            </Form.Control>
            { 
                meta.error && meta.touched && 
                renderErrorText(label, meta.error)
            }
        </Form.Group>
    );
};

export const List = ({ label, input, type, meta, list, itemToAdd, addItem, removeItem, onChangeItem }) => {
    return (
        <Form.Group>
            {renderLabel(label)}
            <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
                <Form.Control 
                    type={type}
                    onChange={e => onChangeItem(e)} 
                    value={itemToAdd}
                    placeholder="Enter one value at a time"
                />
                <Button 
                    variant="outline-success" 
                    style={{ marginLeft: '1rem' }}
                    onClick={addItem}
                >
                    Add
                </Button>
            </div>
            <div className="form-list">
                {list.map(item => (
                    <h5 className="item" key={item}>
                        <Badge className="text" variant="secondary">{item}</Badge>
                        <Badge 
                            className="delete" 
                            variant="light"
                            onClick={() => removeItem(item)}
                        >
                            <i className="fas fa-times" />
                        </Badge>
                    </h5>
                ))}
            </div>
        </Form.Group>
    );
};

const renderErrorText = (label, error) => (
    <Form.Text className="form-error-text">
        {`${label.replace('*', '').toLowerCase()} ${error}`}
    </Form.Text>
);

const renderLabel = (label) => (
    <Form.Label>
        {label.toLowerCase()}
    </Form.Label>
);
