const endpointURL = 'http://localhost:9000/graphql';
export async function loadJobs() {
    const query = `{
        jobs {
            id
            title
            description
            company {
                name
                description
            }
        }
    }`;
    const { jobs } = await graphqlRequest(query);
    return jobs;
}

export async function createJob(input) {
    const mutation = `
        mutation createJob($input: CreateJobInput){
            job: createJob(input: $input) {
                id
                title
                company {
                    id
                    name
                }
            }
        }
    `;

    const { job } = await graphqlRequest(mutation, { input })
    return job;
}

export async function loadCompany(id) {
    const query = `query CompanyQuery($id: ID!) {
            company(id: $id) {
            id
            name
            description
            jobs {
             id
             title
            }
        }
    }`;
    const { company } = await graphqlRequest(query, { id });
    return company;
}

export async function loadJob(id) {
    const query = `query JobQuery($id: ID!){
                job(id: $id) {
                    id
                    title
                    company {
                        id
                        name
                    }
                    description
                }
            }`;
    const { job } = await graphqlRequest(query, { id });
    return job;
}


async function graphqlRequest(query, variables = {}) {
    const response = await fetch(endpointURL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query, variables })
    });
    const responseBody = await response.json();
    if (responseBody.errors) {
        const message = responseBody.errors.map(error => error.message).join('\n');
        throw new Error(message)
    }
    return responseBody.data
}