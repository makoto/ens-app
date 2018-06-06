import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { SubDomainStateFields } from '../../graphql/fragments'
import { fromWei } from 'ethjs-unit'

const GET_SUBDOMAIN_STATE = gql`
  query getSubDomainState {
    subDomainState {
      ...SubDomainStateFields
    }
  }

  ${SubDomainStateFields}
`

const alphabeticalAndAvailable = (a, b) => {
  if (a.available && b.available) {
    if (a.domain > b.domain) {
      return 1
    } else {
      return -1
    }
  } else if (a.available) {
    return -1
  } else if (b.available) {
    return 1
  } else {
    if (a.domain > b.domain) {
      return 1
    } else {
      return -1
    }
  }
}

class SubDomainResults extends Component {
  render() {
    return (
      <Query query={GET_SUBDOMAIN_STATE}>
        {({ data: { subDomainState } }) =>
          [...subDomainState].sort(alphabeticalAndAvailable).map(node => {
            if (!node.available) {
              return (
                <li style={{ textDecoration: 'line-through' }}>
                  {node.label}.{node.domain}.eth
                </li>
              )
            }
            return (
              <li>
                {node.label}.{node.domain}.eth - {fromWei(node.price, 'ether')}{' '}
                ETH
              </li>
            )
          })
        }
      </Query>
    )
  }
}

export default SubDomainResults