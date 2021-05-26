import React from 'react';
import { Form, Select, InputNumber, Divider, Button } from 'antd';
import { datasets } from '@config/constants';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useVisualization } from '@providers/visualization';
import Box from '@components/box';
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
    layers,
    setLayers,
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
      <Form>
        {layers.map((value, index) => (
          <Item key={index} label={`Layer ${index + 1}`} name={`layer${index}`}>
            <Box display="flex" alignItems="center">
              <InputNumber
                value={value}
                min={1}
                onChange={(val) =>
                  setLayers((prevLayers) => {
                    const newLayers = [...prevLayers];
                    newLayers[index] = val;
                    return newLayers;
                  })
                }
                style={{ width: '100%' }}
                placeholder="Tamaño"
              />
              {layers.length > 1 && (
                <MinusCircleOutlined
                  style={{ marginLeft: 5 }}
                  onClick={() =>
                    setLayers((prevLayers) => {
                      const newLayers = [...prevLayers];
                      newLayers.splice(index, 1);
                      return newLayers;
                    })
                  }
                />
              )}
            </Box>
          </Item>
        ))}
        <Item>
          <Button
            type="dashed"
            onClick={() =>
              setLayers((prevLayers) => {
                const newLayers = [...prevLayers, 1];
                return newLayers;
              })
            }
            style={{ width: '100%' }}
            icon={<PlusOutlined />}
          >
            Add field
          </Button>
        </Item>
      </Form>
      <Divider orientation="left">Prueba tu modelo</Divider>
    </Sider>
  );
};

export default Sidebar;
