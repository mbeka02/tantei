import { AGENTS_COLLECTION, AGENTS, USERS, USERS_COLLECTION } from "../mongo/collections";
import { Errors, MyError } from "../constants/errors";
import { ObjectId } from "mongodb";
export interface AGENTWITHID extends AGENTS {
  _id: string;
}

export interface getMultipleAgentsArgs { 
  accounts?: string[] 
}
export class AgentModel {
  //adds a new agent
  async Publish(agent: AGENTS) {
    try {
      await AGENTS_COLLECTION.insertOne(agent);
    } catch (error) {
      throw new MyError("error:" + Errors.NOT_PUBLISH_AGENT);
    }
  }
  //gets all the agents associated with an account
  async GetUserAgents(address: string): Promise<AGENTWITHID[]> {
    try {
      const agents: AGENTWITHID[] = [];
      const cursor = AGENTS_COLLECTION.find({ owner_wallet_address: address });
      for await (const doc of cursor) {
        agents.push({
          ...doc,
          _id: doc._id.toString(),
          time_created: doc.time_created ?? new Date()
        });
      }
      return agents;
    } catch (error) {
      console.error(error);
      throw new MyError("error" + Errors.NOT_GET_USER_AGENTS);
    }
  }

  // Get all available agents with basic metrics
  async GetAllAgents(): Promise<AGENTWITHID[]> {
    try {
      const agents: AGENTWITHID[] = [];
      const cursor = AGENTS_COLLECTION.find({});

      for await (const doc of cursor) {
        agents.push({
          ...doc,
          _id: doc._id.toString(),
          time_created: doc.time_created ?? new Date()
        });
      }
      return agents;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_GET_AGENTS);
    }
  }

  // Get detailed information about a specific agent
  async GetAgentById(agentId: string): Promise<AGENTWITHID | null> {
    try {
      const agent = await AGENTS_COLLECTION.findOne({
        _id: new ObjectId(agentId),
      });
      if (agent) {
        return {...agent, _id: agent!._id.toString(), time_created: agent.time_created ?? new Date()};
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_GET_AGENT);
    }
  }

  // Get agent(s) from their hedera account id
  async GetAgent(args: { hedera_account_id?: string }): Promise<AGENTWITHID | null> {
    try {
      if (args.hedera_account_id) {
        const agent = await AGENTS_COLLECTION.findOne({
          address: args.hedera_account_id,
        });

        if (agent) {
          return {...agent, _id: agent!._id.toString(), time_created: agent.time_created ?? new Date()};
        } else {
          return null;
        }
      }

      return null;
    } catch (err) {
      console.error(err);
      throw new MyError("error:" + Errors.NOT_GET_AGENT);
    }
  }

  // Get multiple agents from list of items
  async GetAgents(args: getMultipleAgentsArgs): Promise<AGENTWITHID[]> {
    try {
      let agents: AGENTWITHID[] = [];
      if (args.accounts) {
        const cursor = AGENTS_COLLECTION.find({
          address: { $in: args.accounts },
        });
        for await (const doc of cursor) {
          agents.push({...doc, _id: doc._id.toString(), time_created: doc.time_created ?? new Date()});
        }
      }

      return agents;
    } catch (err) {
      console.error("Could not get agents", err);
      throw new MyError(Errors.NOT_GET_AGENTS);
    }
  }

  // Update agent details
  async UpdateAgent(
    agentId: string,
    updates: Partial<AGENTS>,
  ): Promise<boolean> {
    try {
      const result = await AGENTS_COLLECTION.updateOne(
        { _id: new ObjectId(agentId) },
        { $set: updates },
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_UPDATE_AGENT);
    }
  }

  // Delete an agent
  async DeleteAgent(agentId: string): Promise<boolean> {
    try {
      const result = await AGENTS_COLLECTION.deleteOne({
        _id: new ObjectId(agentId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(error);
      throw new MyError("error:" + Errors.NOT_DELETE_AGENT);
    }
  }

  async GetUsersFollowingAgent(args: {agent_hedera_id: string}): Promise<USERS[]> {
    try {
      const cursor = USERS_COLLECTION.find({"agents.agent": args.agent_hedera_id});
      const users: USERS[] = [];
      for await (const doc of cursor) {
        users.push(doc);
      }

      return users;
    } catch(err) {
      console.error(err);
      throw new MyError(Errors.NOT_GET_USER);
    }
  }
}
const agentModel = new AgentModel();
export default agentModel;
