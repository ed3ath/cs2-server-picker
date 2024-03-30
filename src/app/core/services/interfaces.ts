export interface Relay {
  ipv4: string;
  port_range: number;
}

export interface Server {
  key: string;
  desc: string;
  geo: number[];
  partners: number;
  relays?: Relay[];
  tier: number;
  blocked: boolean;
}
