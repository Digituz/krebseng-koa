import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';
import BuildingCard from '../components/building-card';
import Description from '../components/description';
import Footer from '../components/footer';
import Header from '../components/header';
import Menu from '../components/menu';
import Content from '../components/content';
import RestFlexClient from "@digituz/rest-flex-client/dist/RestFlexClient";

const BuildingsContainer = styled(Content)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 501px) and (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
`;

function empreendimentos(props) {
  const { buildings } = props;
  return (
    <div>
      <Header />
      <Menu />
      <Description>
        <h1>Empreendimentos</h1>
        <p>Conheça os empreendimentos já entregues pela Krebs Engenharia.</p>
      </Description>
      <BuildingsContainer>
        {
          buildings.map(building => (
            <Link as={`/empreendimentos/${building.path}`} href={`/building?path=${building.path}`}>
              <a>
                <BuildingCard building={building} />
              </a>
            </Link>
          ))
        }
      </BuildingsContainer>
      <Footer />
    </div>
  );
}


empreendimentos.getInitialProps = async function(context) {
  const client = new RestFlexClient('https://krebseng.now.sh/buildings');
  const { path } = context.query;
  const res = await client.find({ path });
  const buildings = await res.json();

  return {
    buildings,
  }
};

export default empreendimentos;
