import React from 'react';
import { Form, Select, InputNumber, Divider } from 'antd';
import { datasets } from '@config/constants';
import { useVisualization } from '@providers/visualization';
import { Sider } from './elements';

const { Item } = Form;
const { Option } = Select;

const Sidebar = () => {
  const {
    dataset,
    setDataset,
    classes,
    setClasses,
    samplesPerClass,
    setSamplesPerClass,
  } = useVisualization();

  return (
    <Sider theme="light" collapsed={false}>
      <Divider orientation="left">Selecciona los datos</Divider>
      <Form
        layout="vertical"
        initialValues={{
          dataset,
          classes,
          samplesPerClass,
        }}
      >
        <Item label="Dataset" name="dataset">
          <Select onChange={({ value }) => setDataset(value)} placeholder="Selecciona un dataset">
            {Object.keys(datasets).map((type) => (
              <Option key={type} value={type}>
                {datasets[type]}
              </Option>
            ))}
          </Select>
        </Item>
        <Item label="Clases" name="classes">
          <InputNumber
            min={0}
            onChange={setClasses}
            style={{ width: '100%' }}
            placeholder="Número de clases"
            formatter={(value) => `${value} clases`}
            parser={(value) => value.replace(' clases', '')}
          />
        </Item>
        <Item label="Samples por clase" name="samplesPerClass">
          <InputNumber
            min={0}
            onChange={setSamplesPerClass}
            style={{ width: '100%' }}
            placeholder="Samples por clase"
            formatter={(value) => `${value} samples`}
            parser={(value) => value.replace(' samples', '')}
          />
        </Item>
      </Form>
      <Divider orientation="left">Entrena tu modelo</Divider>
      <Divider orientation="left">Prueba tu modelo</Divider>
    </Sider>
  );
};

export default Sidebar;
