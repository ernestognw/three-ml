import React from 'react';
import { Form, Select, InputNumber, Divider, Button, Spin } from 'antd';
import Text from 'antd/es/typography/Text';

import { datasets } from '@config/constants';
import {
  CheckCircleFilled,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useVisualization } from '@providers/visualization';
import Box from '@components/box';
import { Sider } from './elements';
import Graph from '../../../components/graph';
import { trainApi } from '../../../clients/axios';

const { Item } = Form;
const { Option } = Select;

const Sidebar = ({ setNNWeights, setResults }) => {
  const {
    dataset,
    setDataset,
    datasetData,
    classes,
    setClasses,
    samplesPerClass,
    setSamplesPerClass,
    layers,
    setLayers,
    batchSize,
    setBatchSize,
    epoch,
    setEpoch,
    trainProportion,
    setTrainProportion,
    selectedPoint,
    setSelectedPoint,
    classification,
    setClassification,
    fetchingDataset,
    training,
    setTraining,
    trained,
    setTrained,
    weights,
    setWeights,
    accuracy,
    setAccuracy,
    loss,
    setLoss,
  } = useVisualization();

  const train = async () => {
    setTraining(true);
    try {
      const { data } = await trainApi.get(
        `/train?dataset_name=${dataset}&classes=${classes}&samples_per_class=${samplesPerClass}&train_proportion=${trainProportion}&hidden_layer_neurons=${layers}&batch_size=${batchSize}&epochs=${epoch}`
      );
      const { accuracy, loss, weights } = data;
      setWeights(weights);
      setNNWeights(weights);
      setAccuracy(accuracy);
      setLoss(loss);
      setTrained(true);
      setTraining(false);
    } catch (e) {
      console.error(`Error while trying to get the dataset: ${e}`);
      setTraining(false);
    }
  };

  const matMul = (A, B) => {
    const n = A.length;
    const k = B.length;
    const m = B[0].length;
    let ans = [];
    for (let row = 0; row < n; row++) {
      let curAns = [];
      for (let col = 0; col < m; col++) {
        let curAnsNum = 0;
        for (let i = 0; i < k; i++) {
          curAnsNum += A[row][i] * B[i][col];
        }
        curAns.push(curAnsNum);
      }
      ans.push(curAns);
    }
    return ans;
  };

  const matSum = (A, B) => {
    let ans = [];
    for (let i = 0; i < A.length; i++) {
      let curAns = [];
      for (let j = 0; j < A[0].length; j++) {
        curAns.push(A[i][j] + B[i][j]);
      }
      ans.push(curAns);
    }
    return ans;
  };

  const relu = (A) => {
    let ans = A.map((row) => {
      return row.map((val) => {
        return val < 0 ? 0 : val;
      });
    });
    return ans;
  };

  const matExp = (A) => {
    let ans = A.map((row) => {
      return row.map((val) => {
        return Math.exp(val);
      });
    });
    return ans;
  };

  const matDiv = (A, d) => {
    let ans = A.map((row) => {
      return row.map((val) => {
        return val / d;
      });
    });
    return ans;
  };

  const matSumAll = (A) => {
    let ans = 0;
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < A[0].length; j++) {
        ans += A[i][j];
      }
    }
    return ans;
  };

  const softmax = (A) => {
    return matDiv(matExp(A), matSumAll(matExp(A)));
  };

  const argMax = (A) => {
    let ans = A.map((row) => {
      let idx = 0;
      let curMax = row[0];
      for (let i = 1; i < row.length; i++) {
        if (row[i] > curMax) {
          idx = i;
          curMax = row[i];
        }
      }
      return idx;
    });
    return ans;
  };

  const handleInference = () => {
    const results = [];
    let curLayer = [[selectedPoint.x, selectedPoint.y]];
    results.push(curLayer);

    for (let idx = 0; idx < weights.length; idx++) {
      let result = matMul(curLayer, weights[idx]['weight']);
      result = matSum(result, [weights[idx]['bias']]);
      result = idx !== weights.length - 1 ? relu(result) : softmax(result);
      results.push(result);
      curLayer = result;
    }
    setResults(results);
    setClassification(argMax(curLayer)[0] + 1);
  };

  return (
    <Sider width={300} theme="light" collapsed={false}>
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
          <Select onChange={setDataset} placeholder="Selecciona un dataset">
            {Object.keys(datasets).map((type) => (
              <Option key={type} value={type}>
                {datasets[type]}
              </Option>
            ))}
          </Select>
        </Item>
        <Graph fetchingDataset={fetchingDataset} dataset={datasetData} />
        <Item label="Clases" name="classes">
          <InputNumber
            min={0}
            max={5}
            onChange={setClasses}
            style={{ width: '100%' }}
            placeholder="Número de clases"
            formatter={(value) => `${value} clases`}
            parser={(value) => value.replace(' clases', '')}
          />
        </Item>
        <Item label="Elementos por clase" name="samplesPerClass">
          <InputNumber
            min={0}
            max={300}
            onChange={setSamplesPerClass}
            style={{ width: '100%' }}
            placeholder="Samples por clase"
            formatter={(value) => `${value} samples`}
            parser={(value) => value.replace(' samples', '')}
          />
        </Item>
      </Form>
      <Divider orientation="left">Entrena tu modelo</Divider>
      <Text strong>Define la cantidad de capas y número de neuronas por capa de tu modelo</Text>
      <Form
        initialValues={{
          batchSize,
          epoch,
          trainProportion,
        }}
      >
        {layers.map((value, index) => (
          <Item
            style={{ marginTop: '10px' }}
            key={index}
            label={`Capa #${index + 1}`}
            name={`layer${index}`}
          >
            <Box display="flex" alignItems="center">
              <InputNumber
                value={value}
                min={1}
                max={50}
                onChange={(val) =>
                  setLayers((prevLayers) => {
                    const newLayers = [...prevLayers];
                    newLayers[index] = val;
                    return newLayers;
                  })
                }
                formatter={(val) => {
                  return `${val} neurona${val === '1' ? '' : 's'}`;
                }}
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
        <Item style={{ marginTop: '10px' }}>
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
            Agregar capa
          </Button>
        </Item>
        <Text strong>Configura las condiciones del entrenamiento de tu modelo</Text>
        <Item style={{ marginTop: '10px' }} label="Tamaño del batch" name="batchSize">
          <InputNumber min={0} onChange={setBatchSize} style={{ width: '100%' }} />
        </Item>
        <Item label="Epoch" name="epoch">
          <InputNumber min={0} max={10} onChange={setEpoch} style={{ width: '100%' }} />
        </Item>
        <Item label="Proporción de entrenamiento" name="trainProportion">
          <InputNumber
            min={0}
            step={0.1}
            max={1}
            onChange={setTrainProportion}
            formatter={(val) => {
              return `${val * 100}%`;
            }}
            style={{ width: '100%' }}
          />
        </Item>
        <Button
          type="primary"
          disabled={!dataset}
          onClick={train}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {!trained && !training ? (
            <Text style={{ color: !dataset ? 'lightgray' : 'white' }}>Entrenar</Text>
          ) : training ? (
            <Text style={{ color: 'white' }}>
              Entrenando <LoadingOutlined color="white" />
            </Text>
          ) : (
            <Text style={{ color: 'white' }}>
              Volver a entrenar <ReloadOutlined color="white" />
            </Text>
          )}
        </Button>
      </Form>
      <>
        {!trained ? (
          <div>
            <Text strong>
              Los resultados de tu entrenamiento saldrán acá en cuanto entrenes tu modelo
            </Text>
          </div>
        ) : (
          <div>
            <Text strong>Resultados</Text>
            <br />
            <Text>Precisión: {(accuracy * 100).toFixed(1)}%</Text>
            <br />
            <Text>Valor del Error: {loss}</Text>
          </div>
        )}
      </>
      <Divider orientation="left">Prueba tu modelo</Divider>
      <Text strong>Selecciona el punto que te gustaría clasificar con tu modelo entrenado</Text>
      <br />
      <Graph
        dataset={datasetData}
        selectedPoint={selectedPoint}
        fetchingDataset={fetchingDataset}
        onClick={(event) => {
          let valueX = null;
          let valueY = null;
          Object.keys(event.chart.scales).forEach((element) => {
            const scale = event.chart.scales[element];
            if (scale.isHorizontal()) {
              valueX = scale.getValueForPixel(event.x);
            } else {
              valueY = scale.getValueForPixel(event.y);
            }
          });
          setSelectedPoint({ x: valueX, y: valueY });
        }}
      />
      <Button
        type="primary"
        disabled={!trained}
        onClick={() => {
          handleInference();
        }}
        style={{ width: '100%', marginTop: '10px' }}
      >
        <Text style={{ color: !trained ? 'lightgray' : 'white' }}>Clasificar punto</Text>
      </Button>
      <Divider orientation="left">Resultados</Divider>
      <>
        {!classification ? (
          <div>
            <Text strong>
              Los resultados de la inferencia saldrán acá en cuanto entrenes tu modelo
            </Text>
          </div>
        ) : (
          <div>
            <Text strong>Resultados</Text>
            <br />
            <Text>
              Punto Clasificado: ({selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed()})
            </Text>
            <br />
            <Text>Clasificación: {classification}</Text>
          </div>
        )}
      </>
    </Sider>
  );
};

export default Sidebar;
